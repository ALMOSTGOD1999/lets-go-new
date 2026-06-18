import { Link } from '@tanstack/react-router';
import type { Column, ColumnDef } from '@tanstack/react-table';
import {
  ArrowDownIcon,
  ArrowUpDownIcon,
  ArrowUpIcon,
  EyeOffIcon,
  MoreHorizontalIcon,
  UsersIcon,
} from 'lucide-react';

import { Button } from '#/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '#/components/ui/dropdown-menu';
import type { Tour } from '#/features/tours/data/schema';

type ToursColumnsOptions = {
  onEdit: (tour: Tour) => void;
};

export function getToursColumns({
  onEdit,
}: ToursColumnsOptions): ColumnDef<Tour>[] {
  return [
    {
      accessorKey: 'name',
      header: ({ column }) => <SortableHeader column={column} title="Name" />,
      cell: ({ row }) => (
        <div className="flex flex-col gap-1">
          <Link
            className="font-medium hover:underline"
            to="/tours/$tourId"
            params={{ tourId: String(row.original.id) }}
          >
            {row.original.name}
          </Link>
          {row.original.description ? (
            <span className="line-clamp-1 text-muted-foreground text-sm">
              {row.original.description}
            </span>
          ) : null}
        </div>
      ),
    },
    {
      accessorKey: 'startDate',
      header: ({ column }) => (
        <SortableHeader column={column} title="Start date" />
      ),
      cell: ({ row }) => formatDate(row.original.startDate),
    },
    {
      accessorKey: 'endDate',
      header: ({ column }) => (
        <SortableHeader column={column} title="End date" />
      ),
      cell: ({ row }) => formatDate(row.original.endDate),
    },
    {
      accessorKey: 'attendeeCount',
      header: ({ column }) => (
        <SortableHeader column={column} title="Clients" />
      ),
      cell: ({ row }) => (
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <UsersIcon className="size-3.5" />
          {row.original.attendeeCount}
        </span>
      ),
    },
    {
      id: 'actions',
      enableHiding: false,
      cell: ({ row }) => (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={<Button variant="ghost" size="icon-sm" />}
            >
              <MoreHorizontalIcon />
              <span className="sr-only">Open tour actions</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                render={
                  <Link
                    to="/tours/$tourId"
                    params={{ tourId: String(row.original.id) }}
                  />
                }
              >
                View details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onEdit(row.original)}>
                Edit
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ];
}

function SortableHeader({
  column,
  title,
}: {
  column: Column<Tour, unknown>;
  title: string;
}) {
  const sorted = column.getIsSorted();

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button
              className="-ml-2 data-[popup-open]:bg-muted"
              size="sm"
              variant="ghost"
            />
          }
        >
          <span>{title}</span>
          {sorted === 'desc' ? (
            <ArrowDownIcon data-icon="inline-end" />
          ) : sorted === 'asc' ? (
            <ArrowUpIcon data-icon="inline-end" />
          ) : (
            <ArrowUpDownIcon data-icon="inline-end" />
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
            <ArrowUpIcon />
            Asc
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
            <ArrowDownIcon />
            Desc
          </DropdownMenuItem>
          {column.getCanHide() ? (
            <>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
                <EyeOffIcon />
                Hide
              </DropdownMenuItem>
            </>
          ) : null}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function formatDate(date: Date | string | null | undefined) {
  if (date == null) {
    return <span className="text-muted-foreground italic">Not set</span>;
  }

  const d = new Date(date);
  if (Number.isNaN(d.getTime())) {
    return <span className="text-muted-foreground italic">Invalid date</span>;
  }

  return new Intl.DateTimeFormat('en', {
    dateStyle: 'medium',
  }).format(d);
}
