import {
  flexRender,
  getCoreRowModel,
  type OnChangeFn,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  SlidersHorizontalIcon,
} from "lucide-react";

import { Button } from "#/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "#/components/ui/dropdown-menu";
import { Input } from "#/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "#/components/ui/table";
import type {
  Itinerary,
  ItinerariesListResult,
} from "#/features/itineraries/data/schema";
import { getItinerariesColumns } from "./itineraries-columns";

type ItinerariesTableProps = {
  result: ItinerariesListResult | undefined;
  isLoading: boolean;
  page: number;
  pageSize: number;
  search: string;
  sorting: SortingState;
  columnVisibility: VisibilityState;
  onColumnVisibilityChange: (visibility: VisibilityState) => void;
  onEdit: (itinerary: Itinerary) => void;
  onDelete: (itinerary: Itinerary) => void;
  onDownloadPdf: (itinerary: Itinerary) => Promise<void>;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onSearchChange: (search: string) => void;
  onSortingChange: OnChangeFn<SortingState>;
};

export function ItinerariesTable({
  result,
  isLoading,
  page,
  pageSize,
  search,
  sorting,
  columnVisibility,
  onColumnVisibilityChange,
  onEdit,
  onDelete,
  onDownloadPdf,
  onPageChange,
  onPageSizeChange,
  onSearchChange,
  onSortingChange,
}: ItinerariesTableProps) {
  const columns = getItinerariesColumns({ onEdit, onDelete, onDownloadPdf });
  const data = result?.data ?? [];
  const pageCount = result?.pageCount ?? 1;

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    state: {
      columnVisibility,
      pagination: {
        pageIndex: page - 1,
        pageSize,
      },
      sorting,
    },
    onColumnVisibilityChange: (updater) => {
      const value =
        typeof updater === "function" ? updater(columnVisibility) : updater;
      onColumnVisibilityChange(value);
    },
    manualPagination: true,
    manualSorting: true,
    onPaginationChange: (updater) => {
      const value =
        typeof updater === "function"
          ? updater({ pageIndex: page - 1, pageSize })
          : updater;

      onPageChange(value.pageIndex + 1);
      if (value.pageSize !== pageSize) {
        onPageSizeChange(value.pageSize);
      }
    },
    onSortingChange,
    pageCount,
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <Input
          aria-label="Search itineraries"
          className="h-9 sm:max-w-xs"
          placeholder="Search itineraries..."
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
        />
        <DropdownMenu>
          <DropdownMenuTrigger render={<Button variant="outline" />}>
            <SlidersHorizontalIcon data-icon="inline-start" />
            View
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              {table
                .getAllColumns()
                .filter((column) => column.getCanHide())
                .map((column) => (
                  <DropdownMenuCheckboxItem
                    checked={column.getIsVisible()}
                    key={column.id}
                    onCheckedChange={(value) => column.toggleVisibility(value)}
                  >
                    {getColumnLabel(column.id)}
                  </DropdownMenuCheckboxItem>
                ))}
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  Loading itineraries...
                </TableCell>
              </TableRow>
            ) : table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No itineraries found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-muted-foreground text-sm">
          {result
            ? `${result.total} itinerar${result.total === 1 ? "y" : "ies"}`
            : ""}
        </p>
        <div className="flex items-center gap-2">
          <Select
            value={`${pageSize}`}
            onValueChange={(value) => onPageSizeChange(Number(value))}
          >
            <SelectTrigger aria-label="Rows per page" className="h-8 w-17.5">
              <SelectValue placeholder={`${pageSize}`} />
            </SelectTrigger>
            <SelectContent side="top">
              <SelectGroup>
                {[10, 20, 50].map((value) => (
                  <SelectItem key={value} value={`${value}`}>
                    {value}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <span className="hidden text-sm font-medium sm:block">
            Rows per page
          </span>
          <span className="text-muted-foreground text-sm">
            Page {page} of {pageCount}
          </span>
          <Button
            disabled={page <= 1}
            onClick={() => onPageChange(1)}
            size="icon"
            type="button"
            variant="outline"
          >
            <ChevronsLeftIcon />
            <span className="sr-only">Go to first page</span>
          </Button>
          <Button
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            size="icon"
            type="button"
            variant="outline"
          >
            <ChevronLeftIcon />
            <span className="sr-only">Go to previous page</span>
          </Button>
          <Button
            disabled={page >= pageCount}
            onClick={() => onPageChange(page + 1)}
            size="icon"
            type="button"
            variant="outline"
          >
            <ChevronRightIcon />
            <span className="sr-only">Go to next page</span>
          </Button>
          <Button
            disabled={page >= pageCount}
            onClick={() => onPageChange(pageCount)}
            size="icon"
            type="button"
            variant="outline"
          >
            <ChevronsRightIcon />
            <span className="sr-only">Go to last page</span>
          </Button>
        </div>
      </div>
    </div>
  );
}

function getColumnLabel(columnId: string) {
  const labels: Record<string, string> = {
    title: "Title",
    destination: "Destination",
    days: "Duration",
    price: "Price",
  };

  return labels[columnId] ?? columnId;
}
