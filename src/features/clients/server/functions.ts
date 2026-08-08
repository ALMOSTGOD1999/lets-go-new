import { createServerFn } from "@tanstack/react-start";
import {
  and,
  asc,
  count,
  desc,
  eq,
  ilike,
  inArray,
  isNotNull,
  isNull,
  or,
  sql,
} from "drizzle-orm";
import { z } from "zod";

import { clients, tourAttendees } from "#/db/schema";
import {
  type ClientEmailFormValues,
  clientEmailFormSchema,
  createClientInputSchema,
  listClientsInputSchema,
  updateClientInputSchema,
} from "#/features/clients/data/schema";
import {
  getAppBaseUrl,
  sendResendEmail,
  trySendResendEmail,
} from "#/features/email/lib/resend";
import {
  renderClientCampaignEmail,
  renderWelcomeEmail,
} from "#/features/email/lib/templates";

const selectClientColumns = {
  id: clients.id,
  name: clients.name,
  email: clients.email,
  phone: clients.phone,
  address: clients.address,
  createdAt: clients.createdAt,
  updatedAt: clients.updatedAt,
  bookingCount: sql<number>`(
    SELECT count(*)::int
    FROM ${tourAttendees}
    WHERE ${tourAttendees.clientId} = ${clients.id}
      AND ${tourAttendees.deletedAt} IS NULL
  )`.as("booking_count"),
};

const sortColumns = {
  name: clients.name,
  email: clients.email,
  phone: clients.phone,
};

export const listClients = createServerFn({ method: "GET" })
  .inputValidator(listClientsInputSchema)
  .handler(async ({ data }) => {
    const db = await getServerDb();
    const where = buildClientWhere(data.search);
    const offset = (data.page - 1) * data.pageSize;
    const sortColumn = sortColumns[data.sortBy];
    const orderBy =
      data.sortDirection === "desc" ? desc(sortColumn) : asc(sortColumn);

    const [rows, totalRows] = await Promise.all([
      db
        .select(selectClientColumns)
        .from(clients)
        .where(where)
        .orderBy(orderBy, desc(clients.id))
        .limit(data.pageSize)
        .offset(offset),
      db.select({ value: count() }).from(clients).where(where),
    ]);

    const total = totalRows[0]?.value ?? 0;

    return {
      data: rows,
      page: data.page,
      pageSize: data.pageSize,
      total,
      pageCount: Math.max(1, Math.ceil(total / data.pageSize)),
    };
  });

export const createClient = createServerFn({ method: "POST" })
  .inputValidator(createClientInputSchema)
  .handler(async ({ data }) => {
    const db = await getServerDb();
    const now = new Date();
    const values = {
      name: data.name.trim(),
      email: data.email.trim().toLowerCase(),
      phone: data.phone.trim(),
      address: data.address?.trim() || null,
      updatedAt: now,
      deletedAt: null,
    };

    const [softDeletedClient] = await db
      .select({ id: clients.id })
      .from(clients)
      .where(
        and(
          isNotNull(clients.deletedAt),
          or(eq(clients.email, values.email), eq(clients.phone, values.phone)),
        ),
      )
      .limit(1);

    if (softDeletedClient) {
      const [restoredClient] = await db
        .update(clients)
        .set(values)
        .where(eq(clients.id, softDeletedClient.id))
        .returning(selectClientColumns);

      return restoredClient;
    }

    const [createdClient] = await db
      .insert(clients)
      .values(values)
      .returning(selectClientColumns);

    await sendWelcomeEmail(createdClient).catch((error) => {
      console.error("[clients] Failed to send welcome email:", error);
    });

    return createdClient;
  });

export const sendClientEmailCampaign = createServerFn({ method: "POST" })
  .inputValidator(clientEmailFormSchema)
  .handler(async ({ data }) => {
    const db = await getServerDb();
    const recipients = await resolveCampaignRecipients(db, data);

    if (!recipients.length) {
      throw new Error("No client email recipients matched your selection");
    }

    let sentCount = 0;
    for (const recipient of recipients) {
      const content = renderClientCampaignEmail({
        clientName: recipient.name,
        emailType: data.emailType,
        subject: data.subject,
        headline: data.headline,
        message: data.message,
        ctaLabel: normalizeText(data.ctaLabel),
        ctaUrl: normalizeText(data.ctaUrl),
      });

      await sendResendEmail({
        to: recipient.email,
        subject: data.subject.trim(),
        html: content.html,
        text: content.text,
        tags: [
          { name: "feature", value: "client-campaign" },
          { name: "kind", value: data.emailType },
        ],
      });
      sentCount += 1;
    }

    return { sentCount };
  });

export const updateClient = createServerFn({ method: "POST" })
  .inputValidator(updateClientInputSchema)
  .handler(async ({ data }) => {
    const db = await getServerDb();
    const [updatedClient] = await db
      .update(clients)
      .set({
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        phone: data.phone.trim(),
        address: data.address?.trim() || null,
        updatedAt: new Date(),
      })
      .where(and(eq(clients.id, data.id), isNull(clients.deletedAt)))
      .returning(selectClientColumns);

    if (!updatedClient) {
      throw new Error("Client not found");
    }

    return updatedClient;
  });

export const deleteClient = createServerFn({ method: "POST" })
  .inputValidator(z.object({ id: z.number().int().positive() }))
  .handler(async ({ data }) => {
    const db = await getServerDb();
    await db
      .update(clients)
      .set({ deletedAt: new Date() })
      .where(and(eq(clients.id, data.id), isNull(clients.deletedAt)));
    return { success: true };
  });

async function getServerDb() {
  const { getDb } = await import("#/db/index.server");
  return getDb();
}

function buildClientWhere(searchValue: string) {
  const search = searchValue.trim();
  const filters = [isNull(clients.deletedAt)];

  if (search) {
    const pattern = `%${search}%`;
    const searchFilter = or(
      ilike(clients.name, pattern),
      ilike(clients.email, pattern),
      ilike(clients.phone, pattern),
      ilike(clients.address, pattern),
    );

    if (searchFilter) {
      filters.push(searchFilter);
    }
  }

  return and(...filters);
}

async function resolveCampaignRecipients(
  db: Awaited<ReturnType<typeof getServerDb>>,
  data: ClientEmailFormValues,
) {
  const rows =
    data.audience === "specific"
      ? await db
          .select({ id: clients.id, name: clients.name, email: clients.email })
          .from(clients)
          .where(
            and(
              isNull(clients.deletedAt),
              inArray(
                clients.id,
                data.clientIds?.length ? data.clientIds : [-1],
              ),
            ),
          )
      : await db
          .select({ id: clients.id, name: clients.name, email: clients.email })
          .from(clients)
          .where(
            data.audience === "filtered"
              ? buildClientWhere(data.search ?? "")
              : isNull(clients.deletedAt),
          )
          .orderBy(asc(clients.name), asc(clients.id));

  const uniqueRecipients = new Map<string, (typeof rows)[number]>();
  for (const row of rows) {
    const email = row.email.trim().toLowerCase();
    if (!email) continue;
    if (!uniqueRecipients.has(email)) {
      uniqueRecipients.set(email, { ...row, email });
    }
  }

  return [...uniqueRecipients.values()];
}

async function sendWelcomeEmail(client: { name: string; email: string }) {
  const email = client.email.trim().toLowerCase();
  if (!email) return;

  const appUrl = getAppBaseUrl();
  const content = renderWelcomeEmail({
    clientName: client.name,
    appUrl: appUrl || undefined,
  });

  await trySendResendEmail({
    to: email,
    subject: `Welcome to Lets Go Tour And Travels, ${client.name}`,
    html: content.html,
    text: content.text,
    tags: [
      { name: "feature", value: "welcome-email" },
      { name: "kind", value: "welcome" },
    ],
  });
}

function normalizeText(value?: string | null) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}
