import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import {
  getClientById,
  listAvailableToursForClient,
  listClientBookings,
} from '#/features/client-bookings/server/functions';
import type { TourAttendeeFormValues } from '#/features/tour-attendees/data/schema';
import {
  createTourAttendee,
  updateTourAttendee,
} from '#/features/tour-attendees/server/functions';

export const clientBookingsQueryKey = (clientId: number) => [
  'client-bookings',
  clientId,
];

export function useClient(clientId: number) {
  return useQuery({
    queryKey: ['client', clientId],
    queryFn: () => getClientById({ data: { id: clientId } }),
  });
}

export function useClientBookings(clientId: number) {
  return useQuery({
    queryKey: clientBookingsQueryKey(clientId),
    queryFn: () => listClientBookings({ data: { clientId } }),
  });
}

export function useAvailableToursForClient(clientId: number) {
  return useQuery({
    queryKey: ['client-bookings', clientId, 'available-tours'],
    queryFn: () => listAvailableToursForClient({ data: { clientId } }),
  });
}

export function useCreateClientBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: TourAttendeeFormValues) =>
      createTourAttendee({ data: input }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['client-bookings'] });
      await queryClient.invalidateQueries({ queryKey: ['tour-attendees'] });
      toast.success('Booking saved');
    },
    onError: (error) =>
      toast.error('Unable to save booking', { description: error.message }),
  });
}

export function useUpdateClientBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: TourAttendeeFormValues & { id: number }) =>
      updateTourAttendee({ data: input }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['client-bookings'] });
      await queryClient.invalidateQueries({ queryKey: ['tour-attendees'] });
      toast.success('Booking updated');
    },
    onError: (error) =>
      toast.error('Unable to update booking', { description: error.message }),
  });
}
