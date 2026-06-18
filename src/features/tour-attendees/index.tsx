import { useMemo, useState } from 'react';

import { Main } from '#/components/layout/main';
import type { Client } from '#/features/clients/data/schema';
import { useClients } from '#/features/clients/hooks/use-clients';
import {
  type ReminderDefaults,
  ReminderSheet,
} from '#/features/reminders/components/reminder-sheet';
import { useCreateReminder } from '#/features/reminders/hooks/use-reminders';
import { AttendeeSearch } from '#/features/tour-attendees/components/attendee-search';
import { AttendeesTable } from '#/features/tour-attendees/components/attendees-table';
import { TourAttendeeSheet } from '#/features/tour-attendees/components/tour-attendee-sheet';
import { TourDetailsHeader } from '#/features/tour-attendees/components/tour-details-header';
import type { TourAttendeeWithClient } from '#/features/tour-attendees/data/schema';
import {
  useCreateTourAttendee,
  useTour,
  useTourAttendees,
  useUpdateTourAttendee,
} from '#/features/tour-attendees/hooks/use-tour-attendees';

export function TourDetailsPage({ tourId }: { tourId: number }) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAttendee, setSelectedAttendee] =
    useState<TourAttendeeWithClient | null>(null);
  const [reminderDefaults, setReminderDefaults] =
    useState<ReminderDefaults | null>(null);
  const tourQuery = useTour(tourId);
  const attendeesQuery = useTourAttendees(tourId);
  const clientsQuery = useClients({
    page: 1,
    pageSize: 100,
    search: '',
    sortBy: 'name',
    sortDirection: 'asc',
  });
  const createAttendeeMutation = useCreateTourAttendee();
  const updateAttendeeMutation = useUpdateTourAttendee();
  const createReminderMutation = useCreateReminder();
  const clients = clientsQuery.data?.data ?? [];
  const attendees = attendeesQuery.data ?? [];
  const filteredAttendees = useMemo(
    () => filterAttendees(attendees, searchTerm),
    [attendees, searchTerm],
  );
  const availableClients = useMemo(
    () => getAvailableClients(clients, attendees, selectedAttendee),
    [attendees, clients, selectedAttendee],
  );
  const totals = useMemo(() => getAttendeeTotals(attendees), [attendees]);
  const travelerTotals = useMemo(
    () => getTravelerTotals(attendees),
    [attendees],
  );
  return (
    <Main>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <TourDetailsHeader
          name={tourQuery.data?.name}
          description={tourQuery.data?.description}
          onAddAttendee={() => {
            setSelectedAttendee(null);
            setSheetOpen(true);
          }}
          summary={
            <div className="flex flex-wrap gap-x-8 gap-y-3 pt-1">
              <SummaryText
                label="Client bookings"
                value={`${attendees.length}`}
              />
              <SummaryText
                label="Travelers"
                value={`${travelerTotals.adults} + ${travelerTotals.children}`}
              />
              <SummaryText
                label="Final total"
                value={formatCurrency(totals.finalTotal)}
              />
              <SummaryText
                label="Outstanding balance"
                value={formatCurrency(totals.balanceAmount)}
              />
            </div>
          }
        />
        <AttendeeSearch
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          onClearSearch={() => setSearchTerm('')}
        />
        <AttendeesTable
          attendees={filteredAttendees}
          isLoading={attendeesQuery.isLoading}
          onEdit={(attendee) => {
            setSelectedAttendee(attendee);
            setSheetOpen(true);
          }}
          onRemind={(attendee) => {
            setReminderDefaults({
              title: `${attendee.clientName} tour reminder`,
              message: `Reminder for ${attendee.clientName} in ${tourQuery.data?.name ?? 'this tour'}`,
              type: 'attendee',
              relatedEntityType: 'attendee',
              relatedEntityId: attendee.id,
              relatedLabel: `${attendee.clientName} · ${tourQuery.data?.name ?? 'Tour'}`,
              targetPath: `/bookings/${attendee.id}/vouchers`,
            });
          }}
        />
        <TourAttendeeSheet
          attendee={selectedAttendee}
          clients={availableClients}
          defaultTourId={tourId}
          open={sheetOpen}
          onOpenChange={(open) => {
            setSheetOpen(open);
            if (!open) setSelectedAttendee(null);
          }}
          onSubmit={async (values) => {
            if (selectedAttendee)
              await updateAttendeeMutation.mutateAsync({
                ...values,
                id: selectedAttendee.id,
              });
            else await createAttendeeMutation.mutateAsync(values);
            setSheetOpen(false);
            setSelectedAttendee(null);
          }}
        />
        <ReminderSheet
          open={!!reminderDefaults}
          reminder={null}
          defaults={reminderDefaults ?? undefined}
          onOpenChange={(open) => {
            if (!open) setReminderDefaults(null);
          }}
          onSubmit={async (values) => {
            await createReminderMutation.mutateAsync(values);
            setReminderDefaults(null);
          }}
        />
      </div>
    </Main>
  );
}

function SummaryText({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
function filterAttendees(
  attendees: TourAttendeeWithClient[],
  searchTerm: string,
) {
  const query = searchTerm.trim().toLowerCase();
  if (!query) return attendees;
  return attendees.filter((attendee) =>
    [attendee.clientName, attendee.clientPhone, attendee.clientEmail].some(
      (value) => value.toLowerCase().includes(query),
    ),
  );
}
function getTravelerTotals(attendees: TourAttendeeWithClient[]) {
  return attendees.reduce(
    (totals, attendee) => ({
      adults: totals.adults + attendee.adultCount,
      children: totals.children + attendee.childCount,
    }),
    { adults: 0, children: 0 },
  );
}
function getAttendeeTotals(attendees: TourAttendeeWithClient[]) {
  return attendees.reduce(
    (totals, attendee) => ({
      finalTotal: totals.finalTotal + attendee.finalTotal,
      balanceAmount: totals.balanceAmount + attendee.balanceAmount,
    }),
    { finalTotal: 0, balanceAmount: 0 },
  );
}
function getAvailableClients(
  clients: Client[],
  attendees: TourAttendeeWithClient[],
  selectedAttendee: TourAttendeeWithClient | null,
) {
  const usedClientIds = new Set(
    attendees
      .filter((attendee) => attendee.id !== selectedAttendee?.id)
      .map((attendee) => attendee.clientId),
  );
  return clients.filter(
    (client) =>
      !usedClientIds.has(client.id) || client.id === selectedAttendee?.clientId,
  );
}
function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
}
