import { createServerFn } from '@tanstack/react-start';
import { and, asc, count, eq, isNull } from 'drizzle-orm';

import { clients, reminders, tourAttendees, tours } from '#/db/schema';

export const getDashboardMetrics = createServerFn({ method: 'GET' }).handler(
  async () => {
    const db = await getServerDb();

    const [tourCount, clientCount, attendeeCount, upcomingReminders] =
      await Promise.all([
        db
          .select({ value: count() })
          .from(tours)
          .where(isNull(tours.deletedAt)),
        db
          .select({ value: count() })
          .from(clients)
          .where(isNull(clients.deletedAt)),
        db
          .select({ value: count() })
          .from(tourAttendees)
          .where(isNull(tourAttendees.deletedAt)),
        db
          .select({
            id: reminders.id,
            title: reminders.title,
            message: reminders.message,
            scheduledAt: reminders.scheduledAt,
            relatedLabel: reminders.relatedLabel,
          })
          .from(reminders)
          .where(and(eq(reminders.status, 'upcoming')))
          .orderBy(asc(reminders.scheduledAt))
          .limit(3),
      ]);

    return {
      totalTours: tourCount[0]?.value ?? 0,
      totalClients: clientCount[0]?.value ?? 0,
      totalAttendees: attendeeCount[0]?.value ?? 0,
      upcomingReminders,
    };
  },
);

async function getServerDb() {
  const { getDb } = await import('#/db/index.server');
  return getDb();
}
