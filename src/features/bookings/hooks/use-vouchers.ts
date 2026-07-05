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
    onSuccess: (data, variables) => {
      const key = vouchersQueryKey(variables.attendeeId);
      qc.setQueryData<Voucher[]>(key, (old) => [...(old ?? []), data]);
      qc.invalidateQueries({ queryKey: key });
      qc.invalidateQueries({ queryKey: ["tour-attendees"] });
      qc.invalidateQueries({ queryKey: ["client-bookings"] });
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
    onSuccess: (data, variables) => {
      const key = vouchersQueryKey(variables.attendeeId);
      qc.setQueryData<Voucher[]>(key, (old) =>
        (old ?? []).map((v) => (v.id === data.id ? data : v)),
      );
      qc.invalidateQueries({ queryKey: key });
      qc.invalidateQueries({ queryKey: ["tour-attendees"] });
      qc.invalidateQueries({ queryKey: ["client-bookings"] });
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
    onSuccess: (_data, id) => {
      qc.setQueryData<Voucher[]>(["vouchers"], (old) =>
        (old ?? []).filter((v) => v.id !== id),
      );
      qc.invalidateQueries({ queryKey: ["vouchers"] });
      qc.invalidateQueries({ queryKey: ["tour-attendees"] });
      qc.invalidateQueries({ queryKey: ["client-bookings"] });
      toast.success("Voucher deleted");
    },
    onError: (error) =>
      toast.error("Unable to delete voucher", { description: error.message }),
  });
}
