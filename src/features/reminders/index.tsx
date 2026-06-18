import { CalendarClockIcon, PlusIcon } from 'lucide-react';
import { useMemo, useState } from 'react';

import { Main } from '#/components/layout/main';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '#/components/ui/alert-dialog';
import { Badge } from '#/components/ui/badge';
import { Button } from '#/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
} from '#/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#/components/ui/table';
import type { Reminder } from '#/features/reminders/data/schema';
import {
  useCancelReminder,
  useCreateReminder,
  useReminders,
  useUpdateReminder,
} from '#/features/reminders/hooks/use-reminders';
import {
  type ReminderDefaults,
  ReminderSheet,
} from './components/reminder-sheet';

export function RemindersPage() {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Reminder | null>(null);
  const [cancelTarget, setCancelTarget] = useState<Reminder | null>(null);
  const remindersQuery = useReminders();
  const createMutation = useCreateReminder();
  const updateMutation = useUpdateReminder();
  const cancelMutation = useCancelReminder();
  const reminders = remindersQuery.data ?? [];
  const counts = useMemo(() => getCounts(reminders), [reminders]);

  const openReminder = (reminder: Reminder) => {
    window.location.assign(reminder.targetPath);
  };

  return (
    <Main>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <Card className="overflow-hidden border-border/60 bg-card/80 shadow-sm backdrop-blur-sm">
          <CardHeader className="gap-4 p-4 sm:px-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-2">
                <h1 className="font-heading text-3xl font-semibold">
                  Reminders
                </h1>
                <p className="max-w-2xl text-sm text-muted-foreground">
                  Server-pushed reminders are delivered to logged-in users when
                  the scheduled trigger runs.
                </p>
              </div>
              <CardAction>
                <Button
                  onClick={() => {
                    setSelected(null);
                    setOpen(true);
                  }}
                >
                  <PlusIcon data-icon="inline-start" />
                  New reminder
                </Button>
              </CardAction>
            </div>
          </CardHeader>
          <CardContent className="grid gap-3 p-4 pt-0 sm:grid-cols-3 sm:px-6">
            <SummaryCard label="Upcoming" value={counts.upcoming} />
            <SummaryCard label="Sent" value={counts.sent} />
            <SummaryCard label="Cancelled" value={counts.cancelled} />
          </CardContent>
        </Card>

        <div className="overflow-hidden rounded-xl border border-border/60 bg-card">
          <div className="hidden md:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reminder</TableHead>
                  <TableHead>When</TableHead>
                  <TableHead>Related</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {remindersQuery.isLoading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      Loading reminders...
                    </TableCell>
                  </TableRow>
                ) : reminders.length ? (
                  reminders.map((reminder) => (
                    <ReminderRow
                      key={reminder.id}
                      reminder={reminder}
                      onOpen={() => openReminder(reminder)}
                      onEdit={() => {
                        setSelected(reminder);
                        setOpen(true);
                      }}
                      onCancel={() => setCancelTarget(reminder)}
                    />
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No reminders yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="grid gap-3 p-3 md:hidden">
            {reminders.map((reminder) => (
              <div
                key={reminder.id}
                className="rounded-lg border border-border/60 bg-card p-4 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 flex-col gap-1">
                    <p className="font-medium">{reminder.title}</p>
                    <p className="text-sm text-muted-foreground">
                      {reminder.message}
                    </p>
                  </div>
                  <Badge variant={statusVariant(reminder.status)}>
                    {formatStatus(reminder.status)}
                  </Badge>
                </div>
                <div className="mt-3 text-sm text-muted-foreground">
                  {formatDateTime(reminder.scheduledAt)} ·{' '}
                  {reminder.relatedLabel || 'General'}
                </div>
                <div className="mt-3 flex justify-end gap-2 border-t border-border/60 pt-3">
                  <ReminderActions
                    reminder={reminder}
                    onOpen={() => openReminder(reminder)}
                    onEdit={() => {
                      setSelected(reminder);
                      setOpen(true);
                    }}
                    onCancel={() => setCancelTarget(reminder)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        <ReminderSheet
          open={open}
          reminder={selected}
          defaults={generalDefaults}
          onOpenChange={(nextOpen) => {
            setOpen(nextOpen);
            if (!nextOpen) setSelected(null);
          }}
          onSubmit={async (values) => {
            if (selected) {
              await updateMutation.mutateAsync({ ...values, id: selected.id });
            } else {
              await createMutation.mutateAsync(values);
            }
            setOpen(false);
            setSelected(null);
          }}
        />

        <AlertDialog
          open={!!cancelTarget}
          onOpenChange={(nextOpen) => {
            if (!nextOpen) setCancelTarget(null);
          }}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Cancel reminder?</AlertDialogTitle>
              <AlertDialogDescription>
                This stops the reminder from being sent by the scheduled push
                trigger.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={cancelMutation.isPending}>
                Keep reminder
              </AlertDialogCancel>
              <AlertDialogAction
                variant="destructive"
                disabled={cancelMutation.isPending}
                onClick={async () => {
                  if (!cancelTarget) return;
                  await cancelMutation.mutateAsync(cancelTarget.id);
                  setCancelTarget(null);
                }}
              >
                Cancel reminder
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </Main>
  );
}

const generalDefaults = {
  type: 'general',
  targetPath: '/reminders',
  relatedLabel: 'General reminder',
} satisfies ReminderDefaults;

function ReminderRow({
  reminder,
  onOpen,
  onEdit,
  onCancel,
}: {
  reminder: Reminder;
  onOpen: () => void;
  onEdit: () => void;
  onCancel: () => void;
}) {
  return (
    <TableRow className="hover:bg-muted/40">
      <TableCell>
        <div className="flex flex-col gap-1">
          <span className="font-medium">{reminder.title}</span>
          <span className="text-sm text-muted-foreground">
            {reminder.message}
          </span>
        </div>
      </TableCell>
      <TableCell>{formatDateTime(reminder.scheduledAt)}</TableCell>
      <TableCell>{reminder.relatedLabel || 'General'}</TableCell>
      <TableCell>
        <Badge variant={statusVariant(reminder.status)}>
          {formatStatus(reminder.status)}
        </Badge>
      </TableCell>
      <TableCell className="text-right">
        <ReminderActions
          reminder={reminder}
          onOpen={onOpen}
          onEdit={onEdit}
          onCancel={onCancel}
        />
      </TableCell>
    </TableRow>
  );
}

function ReminderActions({
  reminder,
  onOpen,
  onEdit,
  onCancel,
}: {
  reminder: Reminder;
  onOpen: () => void;
  onEdit: () => void;
  onCancel: () => void;
}) {
  const canModify = reminder.status === 'upcoming';
  return (
    <div className="flex justify-end gap-2">
      <Button size="sm" variant="outline" onClick={onOpen}>
        Open
      </Button>
      <Button
        size="sm"
        variant="outline"
        onClick={onEdit}
        disabled={!canModify}
      >
        Edit
      </Button>
      <Button
        size="sm"
        variant="destructive"
        onClick={onCancel}
        disabled={!canModify}
      >
        Cancel
      </Button>
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border border-border/60 bg-muted/20 p-3">
      <p className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 flex items-center gap-2 text-2xl font-semibold">
        <CalendarClockIcon className="size-5 text-muted-foreground" />
        {value}
      </p>
    </div>
  );
}

function getCounts(reminders: Reminder[]) {
  return {
    upcoming: reminders.filter((item) => item.status === 'upcoming').length,
    sent: reminders.filter((item) => item.status === 'sent').length,
    cancelled: reminders.filter((item) => item.status === 'cancelled').length,
  };
}

function formatDateTime(value: Date | string) {
  return new Intl.DateTimeFormat('en-IN', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: 'Asia/Kolkata',
  }).format(new Date(value));
}

function formatStatus(status: Reminder['status']) {
  return status.charAt(0).toUpperCase() + status.slice(1);
}

function statusVariant(status: Reminder['status']) {
  if (status === 'cancelled' || status === 'failed') return 'destructive';
  if (status === 'sent') return 'secondary';
  return 'default';
}
