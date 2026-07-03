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

const CHECK_INTERVAL_MS = 60_000; // 1 minute

let intervalHandle: ReturnType<typeof setInterval> | null = null;

async function checkAndSendDueReminders() {
  try {
    const missingEnvVars = getMissingWebPushEnvVars();
    if (missingEnvVars.length) {
      // VAPID keys not configured, skip
      return;
    }

    await pruneOldSentReminders();
    const dueReminders = await listCurrentReminderPushes();

    if (!dueReminders.length) return;

    const { deliveredSubscriptions, expiredSubscriptions, failedSubscriptions } =
      await sendReminderWebPushes(dueReminders);

    if (deliveredSubscriptions > 0) {
      await markReminderPushesSent(
        dueReminders.map((r) => r.id),
      );
    } else {
      await markReminderPushesFailed(
        dueReminders.map((r) => r.id),
      );
    }

    if (deliveredSubscriptions > 0 || expiredSubscriptions > 0) {
      console.log(
        `[reminder-push] Sent ${deliveredSubscriptions}/${dueReminders.length} reminders, ${expiredSubscriptions} expired, ${failedSubscriptions} failed`,
      );
    }
  } catch (error) {
    console.error('[reminder-push] Error checking due reminders:', error);
  }
}

/**
 * Start the reminder push interval that checks for due reminders
 * and sends push notifications at a regular interval.
 * Call this once on server startup.
 */
export function startReminderPushInterval() {
  if (intervalHandle !== null) return; // Already started

  const missingEnvVars = getMissingWebPushEnvVars();
  if (missingEnvVars.length) {
    console.warn(
      `[reminder-push] Skipping push interval — missing env vars: ${missingEnvVars.join(', ')}`,
    );
    return;
  }

  console.log(
    `[reminder-push] Starting push interval (every ${CHECK_INTERVAL_MS / 1000}s)`,
  );

  // Run immediately on startup
  checkAndSendDueReminders();

  // Then run at the interval
  intervalHandle = setInterval(checkAndSendDueReminders, CHECK_INTERVAL_MS);
}
