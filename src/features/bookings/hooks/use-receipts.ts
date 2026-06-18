import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import type { ReceiptFormValues } from '#/features/bookings/data/schema';
import {
  createReceipt,
  deleteReceipt,
  listReceipts,
  updateReceipt,
} from '#/features/bookings/server/functions';

export const receiptsQueryKey = (attendeeId: number) => [
  'receipts',
  attendeeId,
];

export const useReceipts = (attendeeId: number) =>
  useQuery({
    queryKey: receiptsQueryKey(attendeeId),
    queryFn: () => listReceipts({ data: { attendeeId } }),
  });

export function useCreateReceipt() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: ReceiptFormValues) => createReceipt({ data: input }),
    onSuccess: async () => {
      await invalidateReceiptDependents(qc);
      toast.success('Receipt saved');
    },
    onError: (error) =>
      toast.error('Unable to save receipt', { description: error.message }),
  });
}

export function useUpdateReceipt() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: ReceiptFormValues & { id: number }) =>
      updateReceipt({ data: input }),
    onSuccess: async () => {
      await invalidateReceiptDependents(qc);
      toast.success('Receipt updated');
    },
    onError: (error) =>
      toast.error('Unable to update receipt', { description: error.message }),
  });
}

export function useDeleteReceipt() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteReceipt({ data: { id } }),
    onSuccess: async () => {
      await invalidateReceiptDependents(qc);
      toast.success('Receipt deleted');
    },
    onError: (error) =>
      toast.error('Unable to delete receipt', { description: error.message }),
  });
}

async function invalidateReceiptDependents(
  qc: ReturnType<typeof useQueryClient>,
) {
  await Promise.all([
    qc.invalidateQueries({ queryKey: ['receipts'] }),
    qc.invalidateQueries({ queryKey: ['tour-attendees'] }),
    qc.invalidateQueries({ queryKey: ['client-bookings'] }),
  ]);
}
