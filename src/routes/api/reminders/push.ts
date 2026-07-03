import { createFileRoute } from "@tanstack/react-router";

import {
  listCurrentReminderPushes,
  markReminderPushesSent,
  pruneOldSentReminders,
} from "#/features/reminders/server/functions";
import {
  getMissingWebPushEnvVars,
  sendReminderWebPushes,
} from "#/features/reminders/server/web-push";
import { startReminderPushInterval } from "#/features/reminders/server/push-trigger";

// Start the background push interval on server startup
startReminderPushInterval();

const SECRET_HEADER = "x-reminder-secret";
const SECRET_ENV = "REMINDER_PUSH_SECRET";

export const Route = createFileRoute("/api/reminders/push")({
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
          return new Response("Unauthorized", { status: 401 });
        }

        await pruneOldSentReminders();
        const reminders = await listCurrentReminderPushes();

        if (!reminders.length) {
          return new Response(null, { status: 204 });
        }

        const reminderIds = reminders.map((reminder) => reminder.id);

        // Always mark reminders as sent when due — web push is optional
        const missingWebPushEnvVars = getMissingWebPushEnvVars();
        let deliveredSubscriptions = 0;
        let expiredSubscriptions = 0;
        let failedSubscriptions = 0;

        if (!missingWebPushEnvVars.length) {
          const result = await sendReminderWebPushes(reminders);
          deliveredSubscriptions = result.deliveredSubscriptions;
          expiredSubscriptions = result.expiredSubscriptions;
          failedSubscriptions = result.failedSubscriptions;
        }

        await markReminderPushesSent(reminderIds);

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
