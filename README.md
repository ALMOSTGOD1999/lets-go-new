# letsgo

## Local setup

```bash
bun install
cp .env.example .env.local
```

Update `.env.local` with your local values, then run database migrations:

```bash
bun --bun run db:migrate
```

Start the app:

```bash
bun --bun run dev
```

The app runs at http://localhost:3000.

## Web push keys

This project uses `@pushforge/builder` for web push.

Generate VAPID keys:

```bash
bunx @pushforge/builder vapid
```

Copy the public key to `VAPID_PUBLIC_KEY` and the private JWK JSON to
`VAPID_PRIVATE_KEY` in `.env.local`.

## Push notifications

Users subscribe to browser push notifications in the app. Due reminders are sent
when the reminder push API is called:

```http
POST https://your-domain.com/api/reminders/push
x-reminder-secret: your_REMINDER_PUSH_SECRET
```

Example with cron-job.org:

1. Go to https://console.cron-job.org/login.
2. Create a new cron job.
3. Set the URL to `https://your-domain.com/api/reminders/push`.
4. Set method to `POST`.
5. Add header `x-reminder-secret` with the value from `REMINDER_PUSH_SECRET`.
6. Run it on your preferred schedule, for example every 5 minutes.

## Useful commands

```bash
bun --bun run build
bun --bun run test
bun --bun run lint
bun --bun run check
```
