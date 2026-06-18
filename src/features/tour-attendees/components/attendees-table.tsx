import { Link } from '@tanstack/react-router';
import { MoreHorizontalIcon } from 'lucide-react';
import type React from 'react';

import { Badge } from '#/components/ui/badge';
import { Button } from '#/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '#/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '#/components/ui/table';
import type { TourAttendeeWithClient } from '#/features/tour-attendees/data/schema';

export function AttendeesTable({
  attendees,
  isLoading,
  onEdit,
  onRemind,
}: {
  attendees: TourAttendeeWithClient[];
  isLoading: boolean;
  onEdit: (attendee: TourAttendeeWithClient) => void;
  onRemind: (attendee: TourAttendeeWithClient) => void;
}) {
  return (
    <>
      <div className="hidden md:block bg-card rounded-xl border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Client</TableHead>
              <TableHead>Travelers</TableHead>
              <TableHead>Base</TableHead>
              <TableHead>GST</TableHead>
              <TableHead>Discount</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Received</TableHead>
              <TableHead>Balance</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={10} className="h-24 text-center">
                  Loading attendees...
                </TableCell>
              </TableRow>
            ) : attendees.length ? (
              attendees.map((attendee) => (
                <TableRow key={attendee.id}>
                  <TableCell>
                    <div className="flex flex-col gap-1">
                      <Button
                        nativeButton={false}
                        render={
                          <Link
                            to="/bookings/$attendeeId/vouchers"
                            params={{ attendeeId: String(attendee.id) }}
                          />
                        }
                        variant="link"
                        className="h-auto w-fit p-0 text-left font-medium text-foreground"
                      >
                        {attendee.clientName}
                      </Button>
                      <span className="text-muted-foreground text-sm">
                        {attendee.clientPhone}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {attendee.adultCount} adult
                    {attendee.adultCount === 1 ? '' : 's'} ·{' '}
                    {attendee.childCount} child
                    {attendee.childCount === 1 ? '' : 'ren'}
                  </TableCell>
                  <TableCell>{formatCurrency(attendee.subtotal)}</TableCell>
                  <TableCell>{formatCurrency(attendee.gstTotal)}</TableCell>
                  <TableCell>
                    {formatCurrency(attendee.discountAmount)}
                  </TableCell>
                  <TableCell>{formatCurrency(attendee.finalTotal)}</TableCell>
                  <TableCell>
                    {formatCurrency(attendee.receivedAmount)}
                  </TableCell>
                  <TableCell>
                    {formatCurrency(attendee.balanceAmount)}
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={formatStatusVariant(attendee.paymentStatus)}
                    >
                      {formatStatus(attendee.paymentStatus)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end">
                      <AttendeeActionsMenu
                        attendee={attendee}
                        onEdit={onEdit}
                        onRemind={onRemind}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={10} className="h-24 text-center">
                  No attendees added yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="grid gap-3 md:hidden">
        {isLoading ? (
          <EmptyState>Loading attendees...</EmptyState>
        ) : attendees.length ? (
          attendees.map((attendee) => (
            <div
              key={attendee.id}
              className="rounded-lg border border-border/60 bg-card p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 flex-col gap-1">
                  <Button
                    nativeButton={false}
                    render={
                      <Link
                        to="/bookings/$attendeeId/vouchers"
                        params={{ attendeeId: String(attendee.id) }}
                      />
                    }
                    variant="link"
                    className="h-auto w-fit p-0 text-left font-medium"
                  >
                    {attendee.clientName}
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    {attendee.clientPhone}
                  </p>
                </div>
                <Badge variant={formatStatusVariant(attendee.paymentStatus)}>
                  {formatStatus(attendee.paymentStatus)}
                </Badge>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <Metric label="Travelers">
                  {attendee.adultCount} adult
                  {attendee.adultCount === 1 ? '' : 's'} · {attendee.childCount}{' '}
                  child{attendee.childCount === 1 ? '' : 'ren'}
                </Metric>
                <Metric label="Balance">
                  {formatCurrency(attendee.balanceAmount)}
                </Metric>
                <Metric label="Total">
                  {formatCurrency(attendee.finalTotal)}
                </Metric>
                <Metric label="Received">
                  {formatCurrency(attendee.receivedAmount)}
                </Metric>
              </div>
              <div className="mt-3 flex items-center justify-between gap-3 border-t border-border/60 pt-3">
                <div className="text-xs text-muted-foreground">
                  Base {formatCurrency(attendee.subtotal)} · GST{' '}
                  {formatCurrency(attendee.gstTotal)}
                </div>
                <AttendeeActionsMenu
                  attendee={attendee}
                  onEdit={onEdit}
                  onRemind={onRemind}
                />
              </div>
            </div>
          ))
        ) : (
          <EmptyState>No attendees added yet.</EmptyState>
        )}
      </div>
    </>
  );
}

function AttendeeActionsMenu({
  attendee,
  onEdit,
  onRemind,
}: {
  attendee: TourAttendeeWithClient;
  onEdit: (attendee: TourAttendeeWithClient) => void;
  onRemind: (attendee: TourAttendeeWithClient) => void;
}) {
  const attendeeId = String(attendee.id);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" />}>
        <MoreHorizontalIcon />
        <span className="sr-only">Open attendee actions</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => onEdit(attendee)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onRemind(attendee)}>
            Reminder
          </DropdownMenuItem>
          <DropdownMenuItem
            render={
              <Link
                to="/bookings/$attendeeId/vouchers"
                params={{ attendeeId }}
              />
            }
          >
            Vouchers
          </DropdownMenuItem>
          <DropdownMenuItem
            render={
              <Link
                to="/bookings/$attendeeId/receipts"
                params={{ attendeeId }}
              />
            }
          >
            Receipts
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function Metric({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border/60 bg-muted/20 px-3 py-2">
      <div className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 font-medium">{children}</div>
    </div>
  );
}
function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-dashed border-border/60 p-6 text-center text-muted-foreground">
      {children}
    </div>
  );
}
function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
}
function formatStatus(status: TourAttendeeWithClient['paymentStatus']) {
  return {
    unpaid: 'Unpaid',
    partial: 'Partial',
    paid: 'Paid',
    overpaid: 'Overpaid',
  }[status];
}
function formatStatusVariant(status: TourAttendeeWithClient['paymentStatus']) {
  return status === 'paid'
    ? 'secondary'
    : status === 'partial'
      ? 'outline'
      : status === 'overpaid'
        ? 'default'
        : 'destructive';
}
