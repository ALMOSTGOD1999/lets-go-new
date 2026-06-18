import type { Column, ColumnDef } from "@tanstack/react-table";
import {
  ArrowDownIcon,
  ArrowUpDownIcon,
  ArrowUpIcon,
  DownloadIcon,
  EyeOffIcon,
  MoreHorizontalIcon,
} from "lucide-react";
import { useState } from "react";

import { Button } from "#/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu";
import { Spinner } from "#/components/ui/spinner";
import type { Itinerary } from "#/features/itineraries/data/schema";

type ItinerariesColumnsOptions = {
  onEdit: (itinerary: Itinerary) => void;
  onDelete: (itinerary: Itinerary) => void;
  onDownloadPdf: (itinerary: Itinerary) => Promise<void>;
};

export function getItinerariesColumns({
  onEdit,
  onDelete,
  onDownloadPdf,
}: ItinerariesColumnsOptions): ColumnDef<Itinerary>[] {
  return [
    {
      accessorKey: "title",
      header: ({ column }) => <SortableHeader column={column} title="Title" />,
      cell: ({ row }) => (
        <span className="font-medium">{row.original.title}</span>
      ),
    },
    {
      accessorKey: "destination",
      header: ({ column }) => (
        <SortableHeader column={column} title="Destination" />
      ),
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {row.original.destination}
        </span>
      ),
    },
    {
      accessorKey: "days",
      header: ({ column }) => (
        <SortableHeader column={column} title="Duration" />
      ),
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {row.original.days}D / {row.original.nights}N
        </span>
      ),
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) =>
        row.original.price != null ? (
          <span>₹{Number(row.original.price).toLocaleString("en-IN")}</span>
        ) : (
          <span className="text-muted-foreground">—</span>
        ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => (
        <ActionsCell
          itinerary={row.original}
          onEdit={onEdit}
          onDelete={onDelete}
          onDownloadPdf={onDownloadPdf}
        />
      ),
    },
  ];
}

function ActionsCell({
  itinerary,
  onEdit,
  onDelete,
  onDownloadPdf,
}: {
  itinerary: Itinerary;
  onEdit: (i: Itinerary) => void;
  onDelete: (i: Itinerary) => void;
  onDownloadPdf: (i: Itinerary) => Promise<void>;
}) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = async () => {
    setDownloading(true);
    try {
      await onDownloadPdf(itinerary);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="flex items-center justify-end gap-1">
      <Button
        variant="ghost"
        size="icon-sm"
        type="button"
        disabled={downloading}
        onClick={handleDownload}
        title="Download PDF"
      >
        {downloading ? <Spinner /> : <DownloadIcon />}
        <span className="sr-only">Download itinerary PDF</span>
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" />}>
          <MoreHorizontalIcon />
          <span className="sr-only">Open itinerary actions</span>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onEdit(itinerary)}>
            Edit
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={() => onDelete(itinerary)}
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function SortableHeader({
  column,
  title,
}: {
  column: Column<Itinerary, unknown>;
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
