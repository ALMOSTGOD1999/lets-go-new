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
import type { Receipt } from '#/features/bookings/data/schema';

export function ReceiptsTable({
  receipts,
  isLoading,
  onEdit,
  onDelete,
  onShare,
  onRemind,
}: {
  receipts: Receipt[];
  isLoading: boolean;
  onEdit: (receipt: Receipt) => void;
  onDelete: (receipt: Receipt) => void;
  onShare: (receipt: Receipt) => void;
  onRemind: (receipt: Receipt) => void;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-border/60 bg-card">
      <div className="hidden md:block">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Method</TableHead>
              <TableHead>Method Info</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Loading receipts...
                </TableCell>
              </TableRow>
            ) : receipts.length ? (
              receipts.map((receipt) => (
                <TableRow key={receipt.id} className="hover:bg-muted/40">
                  <TableCell>{formatDate(receipt.date)}</TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(receipt.amount)}
                  </TableCell>
                  <TableCell>{receipt.method}</TableCell>
                  <TableCell>{receipt.methodInfo || '—'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end">
                      <ReceiptActions
                        receipt={receipt}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onShare={onShare}
                        onRemind={onRemind}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No receipts yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="grid gap-3 p-3 md:hidden">
        {isLoading ? (
          <EmptyState>Loading receipts...</EmptyState>
        ) : receipts.length ? (
          receipts.map((receipt) => (
            <div
              key={receipt.id}
              className="rounded-lg border border-border/60 bg-card p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex min-w-0 flex-col gap-1">
                  <p className="font-medium">
                    {formatCurrency(receipt.amount)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(receipt.date)}
                  </p>
                </div>
                <ReceiptActions
                  receipt={receipt}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onShare={onShare}
                  onRemind={onRemind}
                />
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <Metric label="Method">{receipt.method}</Metric>
                <Metric label="Reference">{receipt.methodInfo || '—'}</Metric>
              </div>
            </div>
          ))
        ) : (
          <EmptyState>No receipts yet.</EmptyState>
        )}
      </div>
    </div>
  );
}

function ReceiptActions({
  receipt,
  onEdit,
  onDelete,
  onShare,
  onRemind,
}: {
  receipt: Receipt;
  onEdit: (receipt: Receipt) => void;
  onDelete: (receipt: Receipt) => void;
  onShare: (receipt: Receipt) => void;
  onRemind: (receipt: Receipt) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" />}>
        <MoreHorizontalIcon />
        <span className="sr-only">Open receipt actions</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => onEdit(receipt)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onShare(receipt)}>
            Share
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onRemind(receipt)}>
            Reminder
          </DropdownMenuItem>
          <DropdownMenuItem
            variant="destructive"
            onClick={() => onDelete(receipt)}
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

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(value: Date | string) {
  return new Intl.DateTimeFormat('en-IN', { dateStyle: 'medium' }).format(
    new Date(value),
  );
}
