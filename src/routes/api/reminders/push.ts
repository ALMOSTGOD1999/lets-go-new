import { createFileRoute } from '@tanstack/react-router';

import {
  listCurrentReminderPushes,
  markReminderPushesFailed,
  markReminderPushesSent,
  pruneOldSentReminders,
} from '#/features/reminders/server/functions';
import {
  getMissingWebPushEnvVars,
  sendReminderWebPushes,
} from '#/features/reminders/server/web-push';

const SECRET_HEADER = 'x-reminder-secret';
const SECRET_ENV = 'REMINDER_PUSH_SECRET';

export const Route = createFileRoute('/api/reminders/push')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const configuredSecret = process.env[SECRET_ENV];
        const providedSecret = request.headers.get(SECRET_HEADER);

        if (!configuredSecret) {
          return Response.json(
            { error: `${SECRET_ENV} is not configured` },
            { status: 500 },
          );
        }

        if (!providedSecret || providedSecret !== configuredSecret) {
          return new Response('Unauthorized', { status: 401 });
        }

        const missingWebPushEnvVars = getMissingWebPushEnvVars();
        if (missingWebPushEnvVars.length) {
          return Response.json(
            {
              error: `Missing web push env vars: ${missingWebPushEnvVars.join(', ')}`,
            },
            { status: 500 },
          );
        }

        await pruneOldSentReminders();
        const reminders = await listCurrentReminderPushes();

        if (!reminders.length) {
          return new Response(null, { status: 204 });
        }

        const {
          deliveredSubscriptions,
          expiredSubscriptions,
          failedSubscriptions,
        } = await sendReminderWebPushes(reminders);
        const reminderIds = reminders.map((reminder) => reminder.id);

        if (deliveredSubscriptions > 0) {
          await markReminderPushesSent(reminderIds);
        } else {
          await markReminderPushesFailed(reminderIds);
        }

        return Response.json(
          {
            count: reminders.length,
            deliveredSubscriptions,
            expiredSubscriptions,
            failedSubscriptions,
          },
          { status: 202 },
        );
      },
    },
  },
});
