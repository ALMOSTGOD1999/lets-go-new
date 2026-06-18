import { useMemo, useState } from 'react';

import { Main } from '#/components/layout/main';
import { ClientBookingsSearch } from '#/features/client-bookings/components/client-bookings-search';
import { ClientBookingsSummary } from '#/features/client-bookings/components/client-bookings-summary';
import { ClientBookingsTable } from '#/features/client-bookings/components/client-bookings-table';
import { ClientDetailsHeader } from '#/features/client-bookings/components/client-details-header';
import {
  useAvailableToursForClient,
  useClient,
  useClientBookings,
  useCreateClientBooking,
  useUpdateClientBooking,
} from '#/features/client-bookings/hooks/use-client-bookings';
import { ClientSheet } from '#/features/clients/components/client-sheet';
import type { ClientFormValues } from '#/features/clients/data/schema';
import { useUpdateClient } from '#/features/clients/hooks/use-clients';
import { TourAttendeeSheet } from '#/features/tour-attendees/components/tour-attendee-sheet';
import type { TourAttendeeWithTour } from '#/features/tour-attendees/data/schema';

export function ClientDetailsPage({ clientId }: { clientId: number }) {
  const [editClientOpen, setEditClientOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBooking, setSelectedBooking] =
    useState<TourAttendeeWithTour | null>(null);
  const clientQuery = useClient(clientId);
  const bookingsQuery = useClientBookings(clientId);
  const toursQuery = useAvailableToursForClient(clientId);
  const createMutation = useCreateClientBooking();
  const updateMutation = useUpdateClientBooking();
  const updateClientMutation = useUpdateClient();
  const client = clientQuery.data;
  const bookings = bookingsQuery.data ?? [];
  const tours = toursQuery.data ?? [];
  const filteredBookings = useMemo(
    () => filterBookings(bookings, searchTerm),
    [bookings, searchTerm],
  );
  const summary = useMemo(() => getBookingSummary(bookings), [bookings]);
  const title = client?.name ?? 'Client details';

  const submitClient = async (values: ClientFormValues) => {
    await updateClientMutation.mutateAsync({ id: clientId, ...values });
    setEditClientOpen(false);
  };

  return (
    <Main>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <ClientDetailsHeader
          name={title}
          phone={client?.phone}
          email={client?.email}
          address={client?.address}
          canEdit={Boolean(client)}
          onEditClient={() => setEditClientOpen(true)}
          onAssignTour={() => {
            setSelectedBooking(null);
            setBookingOpen(true);
          }}
        >
          <ClientBookingsSummary
            bookingCount={summary.bookingCount}
            adults={summary.adults}
            balance={summary.balance}
            childCount={summary.children}
            totalBilled={summary.totalBilled}
            totalReceived={summary.totalReceived}
          />
        </ClientDetailsHeader>

        <ClientBookingsSearch
          searchTerm={searchTerm}
          onSearchTermChange={setSearchTerm}
          onClearSearch={() => setSearchTerm('')}
        />

        <ClientBookingsTable
          bookings={filteredBookings}
          isLoading={bookingsQuery.isLoading}
          emptyMessage={
            searchTerm.trim()
              ? 'No bookings match your search.'
              : 'No bookings yet.'
          }
          onEdit={(booking) => {
            setSelectedBooking(booking);
            setBookingOpen(true);
          }}
        />

        <ClientSheet
          client={client ?? null}
          open={editClientOpen}
          onOpenChange={setEditClientOpen}
          onSubmit={submitClient}
        />
        <TourAttendeeSheet
          attendee={selectedBooking}
          defaultClientId={clientId}
          mode="client"
          open={bookingOpen}
          tours={tours}
          onOpenChange={(open) => {
            setBookingOpen(open);
            if (!open) setSelectedBooking(null);
          }}
          onSubmit={async (values) => {
            if (selectedBooking) {
              await updateMutation.mutateAsync({
                ...values,
                id: selectedBooking.id,
              });
            } else {
              await createMutation.mutateAsync(values);
            }
            setBookingOpen(false);
          }}
        />
      </div>
    </Main>
  );
}

function filterBookings(bookings: TourAttendeeWithTour[], searchTerm: string) {
  const query = searchTerm.trim().toLowerCase();
  if (!query) return bookings;

  return bookings.filter((booking) => {
    const searchValues = [
      booking.tourName,
      booking.paymentStatus,
      formatDate(booking.tourStartDate),
      formatDate(booking.tourEndDate),
      `${formatDate(booking.tourStartDate)} ${formatDate(booking.tourEndDate)}`,
    ];

    return searchValues.some((value) => value.toLowerCase().includes(query));
  });
}

function getBookingSummary(bookings: TourAttendeeWithTour[]) {
  return bookings.reduce(
    (totals, booking) => ({
      bookingCount: totals.bookingCount + 1,
      adults: totals.adults + booking.adultCount,
      children: totals.children + booking.childCount,
      totalBilled: totals.totalBilled + booking.finalTotal,
      totalReceived: totals.totalReceived + booking.receivedAmount,
      balance: totals.balance + booking.balanceAmount,
    }),
    {
      bookingCount: 0,
      adults: 0,
      children: 0,
      totalBilled: 0,
      totalReceived: 0,
      balance: 0,
    },
  );
}

function formatDate(value: Date | string | null | undefined) {
  if (!value) return 'Not set';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return 'Invalid date';
  return new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium' }).format(date);
}
