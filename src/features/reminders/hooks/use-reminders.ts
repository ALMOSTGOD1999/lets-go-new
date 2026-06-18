import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import type { ReminderFormValues } from '#/features/reminders/data/schema';
import {
  cancelReminder,
  createReminder,
  listReminders,
  updateReminder,
} from '#/features/reminders/server/functions';

export const remindersQueryKey = ['reminders'];

export const useReminders = () =>
  useQuery({
    queryKey: remindersQueryKey,
    queryFn: () => listReminders(),
  });

export function useCreateReminder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: ReminderFormValues) => createReminder({ data: input }),
    onSuccess: async () => {
      await invalidateReminders(qc);
      toast.success('Reminder saved');
    },
    onError: (error) =>
      toast.error('Unable to save reminder', { description: error.message }),
  });
}

export function useUpdateReminder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: ReminderFormValues & { id: number }) =>
      updateReminder({ data: input }),
    onSuccess: async () => {
      await invalidateReminders(qc);
      toast.success('Reminder updated');
    },
    onError: (error) =>
      toast.error('Unable to update reminder', { description: error.message }),
  });
}

export function useCancelReminder() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => cancelReminder({ data: { id } }),
    onSuccess: async () => {
      await invalidateReminders(qc);
      toast.success('Reminder cancelled');
    },
    onError: (error) =>
      toast.error('Unable to cancel reminder', { description: error.message }),
  });
}

async function invalidateReminders(qc: ReturnType<typeof useQueryClient>) {
  await qc.invalidateQueries({ queryKey: remindersQueryKey });
}
