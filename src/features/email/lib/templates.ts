import type { ClientEmailType } from "#/features/clients/data/schema";

const COMPANY = {
  name: "Lets Go Tour And Travels",
  website: "https://www.exploreletsgo.com",
  phone: "+91 94756 82444",
  email: "letsgotourandtravels1@gmail.com",
};

export function renderWelcomeEmail(input: {
  clientName: string;
  appUrl?: string | null;
}) {
  const title = `Welcome to ${COMPANY.name}`;
  const intro = `Hi ${input.clientName}, welcome to ${COMPANY.name}. We are delighted to help you plan memorable trips, smooth bookings, and stress-free travel experiences.`;
  const body = [
    "Your profile is now active in our travel system, so we can assist you faster with itineraries, bookings, reminders, and trip updates.",
    "Whenever you're ready, simply reply to this email or contact us directly and our team will help you plan your next journey.",
  ];

  return renderBrandedEmail({
    accent: "#0ea5a3",
    eyebrow: "Welcome aboard",
    title,
    intro,
    paragraphs: body,
    ctaLabel: input.appUrl ? "Open portal" : undefined,
    ctaUrl: input.appUrl || undefined,
    footerNote: "Thank you for choosing us as your travel partner.",
  });
}

export function renderClientCampaignEmail(input: {
  clientName: string;
  emailType: ClientEmailType;
  subject: string;
  headline: string;
  message: string;
  ctaLabel?: string | null;
  ctaUrl?: string | null;
}) {
  const isReminder = input.emailType === "reminder";

  return renderBrandedEmail({
    accent: isReminder ? "#f97316" : "#0ea5a3",
    eyebrow: isReminder ? "Travel reminder" : "Special travel update",
    title: input.headline,
    intro: `Hi ${input.clientName},`,
    paragraphs: toParagraphs(input.message),
    ctaLabel: normalizeText(input.ctaLabel) ?? undefined,
    ctaUrl: normalizeText(input.ctaUrl) ?? undefined,
    footerNote: isReminder
      ? "Please keep this email handy for your follow-up."
      : "We hope this offer inspires your next trip.",
  });
}

export function renderScheduledReminderEmail(input: {
  clientName?: string | null;
  title: string;
  message: string;
  relatedLabel?: string | null;
  notes?: string | null;
  actionUrl?: string | null;
}) {
  const intro = input.clientName
    ? `Hi ${input.clientName}, this is a quick reminder from ${COMPANY.name}.`
    : `This is a quick reminder from ${COMPANY.name}.`;

  const paragraphs = [input.message];
  if (input.relatedLabel) {
    paragraphs.push(`Related item: ${input.relatedLabel}`);
  }
  if (input.notes) {
    paragraphs.push(input.notes);
  }

  return renderBrandedEmail({
    accent: "#f97316",
    eyebrow: "Reminder",
    title: input.title,
    intro,
    paragraphs,
    ctaLabel: input.actionUrl ? "Open details" : undefined,
    ctaUrl: input.actionUrl || undefined,
    footerNote: "If you need help, just reply to this email and our team will assist you.",
  });
}

function renderBrandedEmail(input: {
  accent: string;
  eyebrow: string;
  title: string;
  intro: string;
  paragraphs: string[];
  ctaLabel?: string;
  ctaUrl?: string;
  footerNote?: string;
}) {
  const paragraphs = input.paragraphs.filter(Boolean).map((paragraph) => `
    <p style="margin:0 0 16px;color:#334155;font-size:15px;line-height:1.75;">${escapeHtml(paragraph)}</p>
  `).join("");

  const cta = input.ctaLabel && input.ctaUrl
    ? `
      <div style="margin-top:28px;">
        <a href="${escapeAttribute(input.ctaUrl)}" style="display:inline-block;padding:12px 20px;border-radius:999px;background:${input.accent};color:#ffffff;text-decoration:none;font-weight:600;font-size:14px;">${escapeHtml(input.ctaLabel)}</a>
      </div>
    `
    : "";

  const html = `
    <div style="margin:0;padding:32px 16px;background:#f8fafc;font-family:Arial,Helvetica,sans-serif;">
      <div style="max-width:640px;margin:0 auto;background:#ffffff;border:1px solid #e2e8f0;border-radius:24px;overflow:hidden;box-shadow:0 12px 40px rgba(15,23,42,0.08);">
        <div style="padding:32px;background:linear-gradient(135deg, ${input.accent} 0%, #0f172a 100%);color:#ffffff;">
          <div style="font-size:12px;letter-spacing:0.18em;text-transform:uppercase;opacity:0.84;margin-bottom:12px;">${escapeHtml(input.eyebrow)}</div>
          <h1 style="margin:0;font-size:30px;line-height:1.2;">${escapeHtml(input.title)}</h1>
          <p style="margin:14px 0 0;font-size:15px;line-height:1.7;color:rgba(255,255,255,0.9);">${escapeHtml(input.intro)}</p>
        </div>
        <div style="padding:32px;">
          ${paragraphs}
          ${cta}
        </div>
        <div style="padding:24px 32px;background:#f8fafc;border-top:1px solid #e2e8f0;">
          <p style="margin:0 0 8px;color:#0f172a;font-weight:700;font-size:15px;">${escapeHtml(COMPANY.name)}</p>
          <p style="margin:0 0 4px;color:#475569;font-size:13px;line-height:1.6;">${escapeHtml(COMPANY.phone)} · ${escapeHtml(COMPANY.email)}</p>
          <p style="margin:0;color:#475569;font-size:13px;line-height:1.6;">${escapeHtml(COMPANY.website)}</p>
          ${input.footerNote ? `<p style="margin:16px 0 0;color:#64748b;font-size:12px;line-height:1.6;">${escapeHtml(input.footerNote)}</p>` : ""}
        </div>
      </div>
    </div>
  `;

  const text = [input.title, input.intro, ...input.paragraphs, input.ctaLabel && input.ctaUrl ? `${input.ctaLabel}: ${input.ctaUrl}` : null, input.footerNote ?? null, `${COMPANY.name} | ${COMPANY.phone} | ${COMPANY.email} | ${COMPANY.website}`]
    .filter(Boolean)
    .join("\n\n");

  return { html, text };
}

function toParagraphs(message: string) {
  return message
    .split(/\n{2,}/)
    .map((part) => part.replace(/\s+/g, " ").trim())
    .filter(Boolean);
}

function normalizeText(value?: string | null) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function escapeAttribute(value: string) {
  return escapeHtml(value);
}
