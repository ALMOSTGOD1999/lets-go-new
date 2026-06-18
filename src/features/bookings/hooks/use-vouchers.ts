import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type {
  Voucher,
  VoucherFormValues,
  VoucherType,
} from "#/features/bookings/data/schema";
import {
  createVoucher,
  deleteVoucher,
  getBookingContext,
  listVouchers,
  updateVoucher,
} from "#/features/bookings/server/functions";

export const vouchersQueryKey = (attendeeId: number) => [
  "vouchers",
  attendeeId,
];
export const useBookingContext = (attendeeId: number) =>
  useQuery({
    queryKey: ["booking-context", attendeeId],
    queryFn: () => getBookingContext({ data: { attendeeId } }),
  });
export const useVouchers = (attendeeId: number) =>
  useQuery({
    queryKey: vouchersQueryKey(attendeeId),
    queryFn: async () => {
      const rows = await listVouchers({ data: { attendeeId } });
      return rows.map((r) => ({
        ...r,
        voucherType: (r.voucherType ?? "hotel") as VoucherType,
        remarks: (r as Voucher).remarks ?? null,
      })) as Voucher[];
    },
  });
export function useCreateVoucher() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: VoucherFormValues) => createVoucher({ data: input }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["vouchers"] });
      toast.success("Voucher saved");
    },
    onError: (error) =>
      toast.error("Unable to save voucher", { description: error.message }),
  });
}
export function useUpdateVoucher() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: VoucherFormValues & { id: number }) =>
      updateVoucher({ data: input }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["vouchers"] });
      toast.success("Voucher updated");
    },
    onError: (error) =>
      toast.error("Unable to update voucher", { description: error.message }),
  });
}
export function useDeleteVoucher() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => deleteVoucher({ data: { id } }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["vouchers"] });
      toast.success("Voucher deleted");
    },
    onError: (error) =>
      toast.error("Unable to delete voucher", { description: error.message }),
  });
}
