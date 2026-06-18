import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import type { TourAttendeeFormValues } from '#/features/tour-attendees/data/schema';
import {
  createTourAttendee,
  getTourById,
  listTourAttendees,
  updateTourAttendee,
} from '#/features/tour-attendees/server/functions';

export const tourAttendeesQueryKey = (tourId: number) => [
  'tour-attendees',
  tourId,
];

export function useTour(tourId: number) {
  return useQuery({
    queryKey: ['tour', tourId],
    queryFn: () => getTourById({ data: { id: tourId } }),
  });
}

export function useTourAttendees(tourId: number) {
  return useQuery({
    queryKey: tourAttendeesQueryKey(tourId),
    queryFn: () => listTourAttendees({ data: { tourId } }),
  });
}

export function useCreateTourAttendee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: TourAttendeeFormValues) =>
      createTourAttendee({ data: input }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['tour-attendees'] });
      toast.success('Attendee saved');
    },
    onError: (error) => {
      toast.error('Unable to save attendee', { description: error.message });
    },
  });
}

export function useUpdateTourAttendee() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: TourAttendeeFormValues & { id: number }) =>
      updateTourAttendee({ data: input }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['tour-attendees'] });
      toast.success('Attendee updated');
    },
    onError: (error) => {
      toast.error('Unable to update attendee', { description: error.message });
    },
  });
}
