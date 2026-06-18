import { randomUUID } from 'node:crypto';
import { hashPassword } from 'better-auth/crypto';
import { config } from 'dotenv';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';

import { account, user } from '#/db/schema';

config({ path: '.env.local' });
config();

type NewUserInput = {
  name: string;
  email: string;
  password: string;
};

const usage = `Usage:
  bun run db:create-user --name "Jane Doe" --email jane@example.com --password "secret"

Options:
  --name      User name
  --email     User email address
  --password  User password
`;

function readFlag(name: string) {
  const index = process.argv.indexOf(`--${name}`);

  if (index === -1) {
    return undefined;
  }

  return process.argv[index + 1];
}

function getUserInput(): NewUserInput {
  if (process.argv.includes('--help') || process.argv.includes('-h')) {
    console.log(usage);
    process.exit(0);
  }

  const name = readFlag('name');
  const email = readFlag('email')?.toLowerCase();
  const password = readFlag('password');

  if (!name || !email || !password) {
    throw new Error(usage);
  }

  return { name, email, password };
}

async function main() {
  const input = getUserInput();
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required. Add it to .env.local.');
  }

  const pool = new Pool({ connectionString: databaseUrl });
  const db = drizzle(pool);

  try {
    const now = new Date();
    const password = await hashPassword(input.password);
    const [existingUser] = await db
      .select({ id: user.id })
      .from(user)
      .where(eq(user.email, input.email))
      .limit(1);
    const userId = existingUser?.id ?? randomUUID();

    const [upsertedUser] = await db
      .insert(user)
      .values({
        id: userId,
        name: input.name,
        email: input.email,
        emailVerified: true,
        createdAt: now,
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: user.email,
        set: {
          name: input.name,
          emailVerified: true,
          updatedAt: now,
        },
      })
      .returning({ id: user.id, name: user.name, email: user.email });

    const [existingAccount] = await db
      .select({ id: account.id })
      .from(account)
      .where(eq(account.userId, userId))
      .limit(1);

    if (existingAccount) {
      await db
        .update(account)
        .set({
          accountId: userId,
          providerId: 'credential',
          password,
          updatedAt: now,
        })
        .where(eq(account.id, existingAccount.id));
    } else {
      await db.insert(account).values({
        id: randomUUID(),
        accountId: userId,
        providerId: 'credential',
        userId,
        password,
        createdAt: now,
        updatedAt: now,
      });
    }

    console.log('Upserted Better Auth user:', upsertedUser);
  } finally {
    await pool.end();
  }
}

main().catch((error: unknown) => {
  const message = getErrorMessage(error);

  console.error(message);
  process.exitCode = 1;
});

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.cause ? `${error.message}\nCause: ${String(error.cause)}` : error.message;
  }

  return String(error);
}
