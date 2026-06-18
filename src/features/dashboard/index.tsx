import {
  CalendarIcon,
  type LucideIcon,
  MapIcon,
  UserCheckIcon,
  UsersIcon,
} from 'lucide-react';

import { Main } from '#/components/layout/main';
import { Badge } from '#/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '#/components/ui/card';
import { Skeleton } from '#/components/ui/skeleton';
import { useDashboardMetrics } from '#/features/dashboard/hooks/use-dashboard';

type DashboardProps = {
  user: {
    name: string;
    email: string;
  };
};

export function Dashboard({ user }: DashboardProps) {
  const metricsQuery = useDashboardMetrics();
  const metrics = metricsQuery.data;

  return (
    <Main>
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-2">
          <h1 className="font-bold text-4xl">Welcome, {user.name}</h1>
          <p className="text-muted-foreground">{user.email}</p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <MetricCard
            icon={MapIcon}
            label="Total Tours"
            value={metrics?.totalTours}
            loading={metricsQuery.isLoading}
          />
          <MetricCard
            icon={UsersIcon}
            label="Total Clients"
            value={metrics?.totalClients}
            loading={metricsQuery.isLoading}
          />
          <MetricCard
            icon={UserCheckIcon}
            label="Enrollments"
            value={metrics?.totalAttendees}
            loading={metricsQuery.isLoading}
          />
          <MetricCard
            icon={CalendarIcon}
            label="Upcoming Reminders"
            value={metrics?.upcomingReminders.length ?? 0}
            loading={metricsQuery.isLoading}
          />
        </div>

        <div className="flex flex-col gap-4">
          <h2 className="font-semibold text-xl">Upcoming Reminders</h2>
          {metricsQuery.isLoading ? (
            <div className="flex flex-col gap-2">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-full" />
            </div>
          ) : metrics?.upcomingReminders.length === 0 ? (
            <p className="text-muted-foreground">No upcoming reminders.</p>
          ) : (
            <div className="flex flex-col gap-2">
              {metrics?.upcomingReminders.map((reminder) => (
                <Card key={reminder.id} size="sm">
                  <CardContent className="flex items-center justify-between gap-4">
                    <div className="flex flex-col gap-1">
                      <span className="font-medium">{reminder.title}</span>
                      {reminder.relatedLabel && (
                        <span className="text-xs text-muted-foreground">
                          {reminder.relatedLabel}
                        </span>
                      )}
                    </div>
                    <Badge variant="secondary">
                      {formatDate(reminder.scheduledAt)}
                    </Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </Main>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  loading,
}: {
  icon: LucideIcon;
  label: string;
  value?: number;
  loading: boolean;
}) {
  return (
    <Card size="sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-normal text-muted-foreground">
            {label}
          </CardTitle>
          <Icon data-icon="inline-end" className="text-muted-foreground/60" />
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <Skeleton className="h-8 w-16" />
        ) : (
          <p className="font-bold text-3xl">{value ?? 0}</p>
        )}
      </CardContent>
    </Card>
  );
}

function formatDate(date: Date | string) {
  const d = date instanceof Date ? date : new Date(date);
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}
