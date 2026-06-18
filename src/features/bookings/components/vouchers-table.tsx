import { MoreHorizontalIcon } from 'lucide-react';
import type React from 'react';

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
import type { Voucher } from '#/features/bookings/data/schema';

export function VouchersTable({
  vouchers,
  onEdit,
  onDelete,
  onShare,
  onRemind,
  isLoading,
}: {
  vouchers: Voucher[];
  onEdit: (v: Voucher) => void;
  onDelete: (v: Voucher) => void;
  onShare: (v: Voucher) => void;
  onRemind: (v: Voucher) => void;
  isLoading: boolean;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-border/60 bg-card">
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Service Type</TableHead>
              <TableHead>Property/Name</TableHead>
              <TableHead>Check-in/out</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Loading vouchers...
                </TableCell>
              </TableRow>
            ) : vouchers.length ? (
              vouchers.map((voucher) => (
                <TableRow key={voucher.id} className="hover:bg-muted/40">
                  <TableCell>{formatDate(voucher.date)}</TableCell>
                  <TableCell>{voucher.serviceType}</TableCell>
                  <TableCell className="font-medium">
                    {voucher.propertyName}
                  </TableCell>
                  <TableCell>
                    {formatRange(voucher.checkinDate, voucher.checkoutDate)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end">
                      <VoucherActions
                        voucher={voucher}
                        onEdit={onEdit}
                        onShare={onShare}
                        onRemind={onRemind}
                        onDelete={onDelete}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No vouchers yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="grid gap-3 p-3 md:hidden">
        {isLoading ? (
          <EmptyState>Loading vouchers...</EmptyState>
        ) : vouchers.length ? (
          vouchers.map((voucher) => (
            <div
              key={voucher.id}
              className="rounded-lg border border-border/60 bg-card p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 flex-col gap-1">
                  <p className="truncate font-medium">{voucher.propertyName}</p>
                  <p className="text-sm text-muted-foreground">
                    {voucher.serviceType}
                  </p>
                </div>
                <VoucherActions
                  voucher={voucher}
                  onEdit={onEdit}
                  onShare={onShare}
                  onRemind={onRemind}
                  onDelete={onDelete}
                />
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <Metric label="Issue date">{formatDate(voucher.date)}</Metric>
                <Metric label="Booking ID">
                  {voucher.bookingId || 'Not set'}
                </Metric>
                <Metric label="Check-in">
                  {voucher.checkinDate ? formatDate(voucher.checkinDate) : '—'}
                </Metric>
                <Metric label="Check-out">
                  {voucher.checkoutDate
                    ? formatDate(voucher.checkoutDate)
                    : '—'}
                </Metric>
              </div>

              {voucher.address ? (
                <div className="mt-3 border-t border-border/60 pt-3 text-sm text-muted-foreground">
                  {voucher.address}
                </div>
              ) : null}
            </div>
          ))
        ) : (
          <EmptyState>No vouchers yet.</EmptyState>
        )}
      </div>
    </div>
  );
}

function VoucherActions({
  voucher,
  onEdit,
  onDelete,
  onShare,
  onRemind,
}: {
  voucher: Voucher;
  onEdit: (v: Voucher) => void;
  onDelete: (v: Voucher) => void;
  onShare: (v: Voucher) => void;
  onRemind: (v: Voucher) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" />}>
        <MoreHorizontalIcon />
        <span className="sr-only">Open voucher actions</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => onEdit(voucher)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onShare(voucher)}>
            Share
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onRemind(voucher)}>
            Reminder
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onClick={() => onDelete(voucher)}
          >
            Delete
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

const formatDate = (v: Date | string) =>
  new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium' }).format(new Date(v));
const formatRange = (a: Date | string | null, b: Date | string | null) =>
  a || b ? `${a ? formatDate(a) : '—'} – ${b ? formatDate(b) : '—'}` : '—';
