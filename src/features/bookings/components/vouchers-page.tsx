import { Link } from "@tanstack/react-router";
import { BusFrontIcon, HotelIcon, PackageIcon, PlusIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { Main } from "#/components/layout/main";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "#/components/ui/alert-dialog";
import { Button } from "#/components/ui/button";
import { Card, CardAction, CardHeader } from "#/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu";
import type { Voucher, VoucherType } from "#/features/bookings/data/schema";
import {
  useBookingContext,
  useCreateVoucher,
  useDeleteVoucher,
  useUpdateVoucher,
  useVouchers,
} from "#/features/bookings/hooks/use-vouchers";
import { shareVoucherPdf } from "#/features/bookings/lib/pdf-share";
import {
  type ReminderDefaults,
  ReminderSheet,
} from "#/features/reminders/components/reminder-sheet";
import { useCreateReminder } from "#/features/reminders/hooks/use-reminders";
import { VoucherSheet } from "./voucher-sheet";
import { VouchersTable } from "./vouchers-table";

export function VouchersPage({ attendeeId }: { attendeeId: number }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Voucher | null>(null);
  const [selectedType, setSelectedType] = useState<VoucherType>("hotel");
  const [reminderDefaults, setReminderDefaults] =
    useState<ReminderDefaults | null>(null);
  const [voucherToDelete, setVoucherToDelete] = useState<Voucher | null>(null);
  const { data = [], isLoading } = useVouchers(attendeeId);
  const { data: bookingContext } = useBookingContext(attendeeId);
  const createMutation = useCreateVoucher();
  const updateMutation = useUpdateVoucher();
  const deleteMutation = useDeleteVoucher();
  const createReminderMutation = useCreateReminder();
  return (
    <Main>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <Card className="overflow-hidden border-border/60 bg-card/80 shadow-sm backdrop-blur-sm">
          <CardHeader className="gap-4 p-4 sm:px-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-2">
                <h1 className="font-heading text-3xl font-semibold">
                  Vouchers
                </h1>
                <div className="flex gap-2">
                  <Button
                    nativeButton={false}
                    render={
                      <Link
                        to="/bookings/$attendeeId/vouchers"
                        params={{ attendeeId: String(attendeeId) }}
                      />
                    }
                    variant="secondary"
                  >
                    Vouchers
                  </Button>
                  <Button
                    nativeButton={false}
                    render={
                      <Link
                        to="/bookings/$attendeeId/receipts"
                        params={{ attendeeId: String(attendeeId) }}
                      />
                    }
                    variant="outline"
                  >
                    Receipts
                  </Button>
                </div>
              </div>
              <CardAction>
                <DropdownMenu>
                  <DropdownMenuTrigger render={<Button />}>
                    <PlusIcon data-icon="inline-start" />
                    New voucher
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => {
                        setSelected(null);
                        setSelectedType("hotel");
                        setOpen(true);
                      }}
                    >
                      <HotelIcon />
                      Hotel Voucher
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setSelected(null);
                        setSelectedType("package");
                        setOpen(true);
                      }}
                    >
                      <PackageIcon />
                      Package Voucher
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setSelected(null);
                        setSelectedType("vehicle");
                        setOpen(true);
                      }}
                    >
                      <BusFrontIcon />
                      Vehicle Voucher
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardAction>
            </div>
          </CardHeader>
        </Card>
        <VouchersTable
          vouchers={data}
          isLoading={isLoading}
          onEdit={(v) => {
            setSelected(v);
            setSelectedType((v.voucherType as VoucherType) ?? "hotel");
            setOpen(true);
          }}
          onDelete={setVoucherToDelete}
          onShare={async (voucher) => {
            if (!bookingContext) {
              toast.error("Booking details are still loading");
              return;
            }
            try {
              await shareVoucherPdf(voucher, bookingContext);
              toast.success("Voucher PDF ready");
            } catch (error) {
              if (
                error instanceof DOMException &&
                error.name === "AbortError"
              ) {
                return;
              }
              toast.error("Unable to share voucher", {
                description: error instanceof Error ? error.message : undefined,
              });
            }
          }}
          onRemind={(voucher) => {
            setReminderDefaults({
              title: `Voucher reminder #${voucher.id}`,
              message: `${voucher.serviceType} reminder for ${voucher.propertyName}`,
              type: "voucher",
              relatedEntityType: "voucher",
              relatedEntityId: voucher.id,
              relatedLabel: voucher.propertyName,
              targetPath: `/bookings/${attendeeId}/vouchers`,
            });
          }}
        />
        <AlertDialog
          open={!!voucherToDelete}
          onOpenChange={(nextOpen) => {
            if (!nextOpen) setVoucherToDelete(null);
          }}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete voucher?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete this voucher. This action cannot be
                undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={deleteMutation.isPending}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                variant="destructive"
                disabled={deleteMutation.isPending}
                onClick={async () => {
                  if (!voucherToDelete) return;
                  await deleteMutation.mutateAsync(voucherToDelete.id);
                  setVoucherToDelete(null);
                }}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <VoucherSheet
          open={open}
          voucher={selected}
          attendeeId={attendeeId}
          initialType={selectedType}
          onOpenChange={(o) => {
            setOpen(o);
            if (!o) setSelected(null);
          }}
          onSubmit={async (values) => {
            if (selected)
              await updateMutation.mutateAsync({ ...values, id: selected.id });
            else await createMutation.mutateAsync(values);
            setOpen(false);
            setSelected(null);
          }}
        />
        <ReminderSheet
          open={!!reminderDefaults}
          reminder={null}
          defaults={reminderDefaults ?? undefined}
          onOpenChange={(nextOpen) => {
            if (!nextOpen) setReminderDefaults(null);
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
