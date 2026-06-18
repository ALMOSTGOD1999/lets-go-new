import { Link } from "@tanstack/react-router";
import type { Column, ColumnDef } from "@tanstack/react-table";
import {
  ArrowDownIcon,
  ArrowUpDownIcon,
  ArrowUpIcon,
  CalendarCheckIcon,
  EyeOffIcon,
  MoreHorizontalIcon,
} from "lucide-react";

import { Button } from "#/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu";
import type { Client } from "#/features/clients/data/schema";

type ClientsColumnsOptions = {
  onEdit: (client: Client) => void;
};

export function getClientsColumns({
  onEdit,
}: ClientsColumnsOptions): ColumnDef<Client>[] {
  return [
    {
      accessorKey: "name",
      header: ({ column }) => <SortableHeader column={column} title="Name" />,
      cell: ({ row }) => (
        <Link
          className="font-medium hover:underline"
          to="/clients/$clientId"
          params={{ clientId: String(row.original.id) }}
        >
          {row.original.name}
        </Link>
      ),
    },
    {
      accessorKey: "email",
      header: ({ column }) => <SortableHeader column={column} title="Email" />,
      cell: ({ row }) => (
        <a
          className="hover:text-foreground hover:underline"
          href={`mailto:${row.original.email}`}
        >
          {row.original.email}
        </a>
      ),
    },
    {
      accessorKey: "phone",
      header: ({ column }) => <SortableHeader column={column} title="Phone" />,
      cell: ({ row }) => {
        const { phone, name } = row.original;
        const url = buildWhatsAppUrl(phone, name);
        return (
          <a
            className="flex items-center gap-1.5 text-[#25D366] hover:text-[#128C7E] hover:underline"
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            title={`Open WhatsApp chat with ${name}`}
          >
            <WhatsAppIcon className="size-3.5 shrink-0" />
            {phone}
          </a>
        );
      },
    },
    {
      accessorKey: "bookingCount",
      header: ({ column }) => (
        <SortableHeader column={column} title="Bookings" />
      ),
      cell: ({ row }) => (
        <span className="flex items-center gap-1.5 text-muted-foreground">
          <CalendarCheckIcon className="size-3.5" />
          {row.original.bookingCount}
        </span>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => (
        <div className="flex justify-end">
          <DropdownMenu>
            <DropdownMenuTrigger
              render={<Button variant="ghost" size="icon-sm" />}
            >
              <MoreHorizontalIcon />
              <span className="sr-only">Open client actions</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                render={
                  <Link
                    to="/clients/$clientId"
                    params={{ clientId: String(row.original.id) }}
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
  column: Column<Client, unknown>;
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
          {sorted === "desc" ? (
            <ArrowDownIcon data-icon="inline-end" />
          ) : sorted === "asc" ? (
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

// ─── Helpers ──────────────────────────────────────────────────────────────────

function buildWhatsAppUrl(phone: string, name: string) {
  // Keep digits only — WhatsApp ignores formatting characters in the number
  const number = phone.replace(/\D/g, "");
  const message = `Hello ${name}! 👋 Greetings from Lets Go Tour And Travels. How can we help you today?`;
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}
