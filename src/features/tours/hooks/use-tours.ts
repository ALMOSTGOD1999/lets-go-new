import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import type {
  ListToursInput,
  TourFormValues,
} from '#/features/tours/data/schema';
import {
  createTour,
  listTours,
  updateTour,
} from '#/features/tours/server/functions';

export const toursQueryKey = (input: ListToursInput) => ['tours', input];

export function useTours(input: ListToursInput) {
  return useQuery({
    queryKey: toursQueryKey(input),
    queryFn: () => listTours({ data: input }),
    enabled: typeof window !== 'undefined',
  });
}

export function useCreateTour() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: TourFormValues) => createTour({ data: input }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['tours'] });
      toast.success('Tour saved');
    },
    onError: (error) => {
      toast.error('Unable to save tour', {
        description: error.message,
      });
    },
  });
}

export function useUpdateTour() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: TourFormValues & { id: number }) =>
      updateTour({ data: input }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['tours'] });
      toast.success('Tour updated');
    },
    onError: (error) => {
      toast.error('Unable to update tour', {
        description: error.message,
      });
    },
  });
}
