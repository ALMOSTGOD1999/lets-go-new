import {
  listCurrentReminderPushes,
  markReminderPushesSent,
  pruneOldSentReminders,
} from "#/features/reminders/server/functions";
import {
  getMissingWebPushEnvVars,
  sendReminderWebPushes,
} from "#/features/reminders/server/web-push";

const CHECK_INTERVAL_MS = 60_000; // 1 minute

let intervalHandle: ReturnType<typeof setInterval> | null = null;

async function checkAndSendDueReminders() {
  try {
    await pruneOldSentReminders();
    const dueReminders = await listCurrentReminderPushes();

    if (!dueReminders.length) return;

    // Always mark reminders as sent when they're due, regardless of push status
    // Web push is just a notification channel, not the reminder itself
    const missingEnvVars = getMissingWebPushEnvVars();
    let deliveredSubscriptions = 0;
    let expiredSubscriptions = 0;
    let failedSubscriptions = 0;

    if (!missingEnvVars.length) {
      // Only attempt web push if VAPID is configured
      const result = await sendReminderWebPushes(dueReminders);
      deliveredSubscriptions = result.deliveredSubscriptions;
      expiredSubscriptions = result.expiredSubscriptions;
      failedSubscriptions = result.failedSubscriptions;
    }

    // Mark reminders as sent (they're now "fired")
    await markReminderPushesSent(dueReminders.map((r) => r.id));

    if (missingEnvVars.length) {
      console.log(
        `[reminder-push] Processed ${dueReminders.length} due reminders (web push not configured)`,
      );
    } else if (deliveredSubscriptions > 0 || expiredSubscriptions > 0) {
      console.log(
        `[reminder-push] Sent ${deliveredSubscriptions}/${dueReminders.length} reminders, ${expiredSubscriptions} expired, ${failedSubscriptions} failed`,
      );
    }
  } catch (error) {
    console.error("[reminder-push] Error checking due reminders:", error);
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
    console.log(
      `[reminder-push] Starting reminder check interval (web push not configured — missing: ${missingEnvVars.join(", ")})`,
    );
  } else {
    console.log(
      `[reminder-push] Starting push interval (every ${CHECK_INTERVAL_MS / 1000}s)`,
    );
  }

  // Run immediately on startup
  checkAndSendDueReminders();

  // Then run at the interval
  intervalHandle = setInterval(checkAndSendDueReminders, CHECK_INTERVAL_MS);
}
