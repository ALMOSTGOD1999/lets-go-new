import { Link } from '@tanstack/react-router';
import { MoreHorizontalIcon } from 'lucide-react';

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
import type { TourAttendeeWithTour } from '#/features/tour-attendees/data/schema';

export function ClientBookingsTable({
  bookings,
  isLoading,
  onEdit,
  emptyMessage = 'No bookings yet.',
}: {
  bookings: TourAttendeeWithTour[];
  isLoading: boolean;
  onEdit: (booking: TourAttendeeWithTour) => void;
  emptyMessage?: string;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-border/60 bg-card">
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tour</TableHead>
              <TableHead>Dates</TableHead>
              <TableHead>Travelers</TableHead>
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
                <TableCell colSpan={8} className="h-24 text-center">
                  Loading bookings...
                </TableCell>
              </TableRow>
            ) : bookings.length ? (
              bookings.map((booking) => (
                <TableRow key={booking.id} className="hover:bg-muted/40">
                  <TableCell className="font-medium text-foreground">
                    <Button
                      nativeButton={false}
                      render={
                        <Link
                          to="/bookings/$attendeeId/vouchers"
                          params={{ attendeeId: String(booking.id) }}
                        />
                      }
                      variant="link"
                      className="h-auto p-0 text-left font-medium text-foreground"
                    >
                      {booking.tourName}
                    </Button>
                  </TableCell>
                  <TableCell>
                    {formatDate(booking.tourStartDate)} –{' '}
                    {formatDate(booking.tourEndDate)}
                  </TableCell>
                  <TableCell>
                    {booking.adultCount} + {booking.childCount}
                  </TableCell>
                  <TableCell>{formatCurrency(booking.finalTotal)}</TableCell>
                  <TableCell>
                    {formatCurrency(booking.receivedAmount)}
                  </TableCell>
                  <TableCell>{formatCurrency(booking.balanceAmount)}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(booking.paymentStatus)}>
                      {formatStatus(booking.paymentStatus)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end">
                      <BookingActionsMenu booking={booking} onEdit={onEdit} />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="grid gap-3 p-3 md:hidden">
        {isLoading ? (
          <EmptyState>Loading bookings...</EmptyState>
        ) : bookings.length ? (
          bookings.map((booking) => (
            <div
              key={booking.id}
              className="rounded-lg border border-border/60 bg-card p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 flex-col gap-1">
                  <Button
                    nativeButton={false}
                    render={
                      <Link
                        to="/bookings/$attendeeId/vouchers"
                        params={{ attendeeId: String(booking.id) }}
                      />
                    }
                    variant="link"
                    className="h-auto w-fit p-0 text-left font-medium"
                  >
                    {booking.tourName}
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(booking.tourStartDate)} –{' '}
                    {formatDate(booking.tourEndDate)}
                  </p>
                </div>
                <Badge variant={getStatusVariant(booking.paymentStatus)}>
                  {formatStatus(booking.paymentStatus)}
                </Badge>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <Metric label="Travelers">
                  {booking.adultCount} adult
                  {booking.adultCount === 1 ? '' : 's'} · {booking.childCount}{' '}
                  child{booking.childCount === 1 ? '' : 'ren'}
                </Metric>
                <Metric label="Balance">
                  {formatCurrency(booking.balanceAmount)}
                </Metric>
                <Metric label="Total">
                  {formatCurrency(booking.finalTotal)}
                </Metric>
                <Metric label="Received">
                  {formatCurrency(booking.receivedAmount)}
                </Metric>
              </div>

              <div className="mt-3 flex items-center justify-between gap-3 border-t border-border/60 pt-3">
                <div className="text-xs text-muted-foreground">
                  Dates {formatDate(booking.tourStartDate)} –{' '}
                  {formatDate(booking.tourEndDate)}
                </div>
                <BookingActionsMenu booking={booking} onEdit={onEdit} />
              </div>
            </div>
          ))
        ) : (
          <EmptyState>{emptyMessage}</EmptyState>
        )}
      </div>
    </div>
  );
}

function BookingActionsMenu({
  booking,
  onEdit,
}: {
  booking: TourAttendeeWithTour;
  onEdit: (booking: TourAttendeeWithTour) => void;
}) {
  const attendeeId = String(booking.id);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" />}>
        <MoreHorizontalIcon />
        <span className="sr-only">Open booking actions</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => onEdit(booking)}>
            Edit
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

function getStatusVariant(status: TourAttendeeWithTour['paymentStatus']) {
  if (status === 'paid') return 'secondary';
  if (status === 'partial') return 'outline';
  if (status === 'overpaid') return 'default';
  return 'destructive';
}

function formatStatus(status: TourAttendeeWithTour['paymentStatus']) {
  return {
    unpaid: 'Unpaid',
    partial: 'Partial',
    paid: 'Paid',
    overpaid: 'Overpaid',
  }[status];
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

function formatDate(value: Date | string | null | undefined) {
  if (!value) return 'Not set';
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return 'Invalid date';
  return new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium' }).format(date);
}
