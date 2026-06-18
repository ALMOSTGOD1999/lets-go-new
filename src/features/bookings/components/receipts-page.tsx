import { Link } from '@tanstack/react-router';
import { PlusIcon } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';

import { Main } from '#/components/layout/main';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '#/components/ui/alert-dialog';
import { Button } from '#/components/ui/button';
import { Card, CardAction, CardHeader } from '#/components/ui/card';
import type { Receipt } from '#/features/bookings/data/schema';
import {
  useCreateReceipt,
  useDeleteReceipt,
  useReceipts,
  useUpdateReceipt,
} from '#/features/bookings/hooks/use-receipts';
import { useBookingContext } from '#/features/bookings/hooks/use-vouchers';
import { shareReceiptPdf } from '#/features/bookings/lib/pdf-share';
import {
  type ReminderDefaults,
  ReminderSheet,
} from '#/features/reminders/components/reminder-sheet';
import { useCreateReminder } from '#/features/reminders/hooks/use-reminders';
import { ReceiptSheet } from './receipt-sheet';
import { ReceiptsTable } from './receipts-table';

export function ReceiptsPage({ attendeeId }: { attendeeId: number }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<Receipt | null>(null);
  const [reminderDefaults, setReminderDefaults] =
    useState<ReminderDefaults | null>(null);
  const [receiptToDelete, setReceiptToDelete] = useState<Receipt | null>(null);
  const { data = [], isLoading } = useReceipts(attendeeId);
  const { data: bookingContext } = useBookingContext(attendeeId);
  const createMutation = useCreateReceipt();
  const updateMutation = useUpdateReceipt();
  const deleteMutation = useDeleteReceipt();
  const createReminderMutation = useCreateReminder();

  return (
    <Main>
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <Card className="overflow-hidden border-border/60 bg-card/80 shadow-sm backdrop-blur-sm">
          <CardHeader className="gap-4 p-4 sm:px-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex flex-col gap-2">
                <h1 className="font-heading text-3xl font-semibold">
                  Receipts
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
                    variant="outline"
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
                    variant="secondary"
                  >
                    Receipts
                  </Button>
                </div>
              </div>
              <CardAction>
                <Button
                  onClick={() => {
                    setSelected(null);
                    setOpen(true);
                  }}
                >
                  <PlusIcon data-icon="inline-start" />
                  New receipt
                </Button>
              </CardAction>
            </div>
          </CardHeader>
        </Card>
        <ReceiptsTable
          receipts={data}
          isLoading={isLoading}
          onEdit={(receipt) => {
            setSelected(receipt);
            setOpen(true);
          }}
          onDelete={setReceiptToDelete}
          onShare={async (receipt) => {
            if (!bookingContext) {
              toast.error('Booking details are still loading');
              return;
            }
            try {
              await shareReceiptPdf(receipt, bookingContext);
              toast.success('Receipt PDF ready');
            } catch (error) {
              if (
                error instanceof DOMException &&
                error.name === 'AbortError'
              ) {
                return;
              }
              toast.error('Unable to share receipt', {
                description: error instanceof Error ? error.message : undefined,
              });
            }
          }}
          onRemind={(receipt) => {
            setReminderDefaults({
              title: `Receipt reminder #${receipt.id}`,
              message: `Follow up receipt payment of ${formatCurrency(receipt.amount)}`,
              type: 'receipt',
              relatedEntityType: 'receipt',
              relatedEntityId: receipt.id,
              relatedLabel: `Receipt #${receipt.id}`,
              targetPath: `/bookings/${attendeeId}/receipts`,
            });
          }}
        />
        <AlertDialog
          open={!!receiptToDelete}
          onOpenChange={(nextOpen) => {
            if (!nextOpen) setReceiptToDelete(null);
          }}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete receipt?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete this receipt. This action cannot be
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
                  if (!receiptToDelete) return;
                  await deleteMutation.mutateAsync(receiptToDelete.id);
                  setReceiptToDelete(null);
                }}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
        <ReceiptSheet
          open={open}
          receipt={selected}
          attendeeId={attendeeId}
          onOpenChange={(nextOpen) => {
            setOpen(nextOpen);
            if (!nextOpen) setSelected(null);
          }}
          onSubmit={async (values) => {
            if (selected) {
              await updateMutation.mutateAsync({ ...values, id: selected.id });
            } else {
              await createMutation.mutateAsync(values);
            }
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

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
}
