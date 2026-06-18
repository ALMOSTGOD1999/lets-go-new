import type { SortingState, VisibilityState } from "@tanstack/react-table";
import { PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

import { Main } from "#/components/layout/main";
import { Button } from "#/components/ui/button";
import { ItinerarySheet } from "#/features/itineraries/components/itinerary-sheet";
import { ItinerariesTable } from "#/features/itineraries/components/itineraries-table";
import type {
  Itinerary,
  ItineraryFormValues,
} from "#/features/itineraries/data/schema";
import {
  useCreateItinerary,
  useDeleteItinerary,
  useItineraries,
  useUpdateItinerary,
} from "#/features/itineraries/hooks/use-itineraries";
import { shareItineraryPdf } from "#/features/itineraries/lib/pdf";

export function ItinerariesPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [sorting, setSorting] = useState<SortingState>([
    { id: "title", desc: false },
  ]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedItinerary, setSelectedItinerary] = useState<Itinerary | null>(
    null,
  );

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 500);

    return () => window.clearTimeout(timeoutId);
  }, [searchInput]);

  const sort = getItinerarySort(sorting);
  const itinerariesQuery = useItineraries({
    page,
    pageSize,
    search,
    sortBy: sort.id,
    sortDirection: sort.desc ? "desc" : "asc",
  });
  const createItineraryMutation = useCreateItinerary();
  const updateItineraryMutation = useUpdateItinerary();
  const deleteItineraryMutation = useDeleteItinerary();

  useEffect(() => {
    const pageCount = itinerariesQuery.data?.pageCount;

    if (pageCount && page > pageCount) {
      setPage(pageCount);
    }
  }, [itinerariesQuery.data?.pageCount, page]);

  const openCreateSheet = () => {
    setSelectedItinerary(null);
    setSheetOpen(true);
  };

  const openEditSheet = (itinerary: Itinerary) => {
    setSelectedItinerary(itinerary);
    setSheetOpen(true);
  };

  const handleDelete = (itinerary: Itinerary) => {
    deleteItineraryMutation.mutate(itinerary.id);
  };

  const handleDownloadPdf = async (itinerary: Itinerary) => {
    try {
      await shareItineraryPdf(itinerary);
    } catch (error) {
      toast.error("Could not generate PDF", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  const submitItinerary = async (values: ItineraryFormValues) => {
    if (selectedItinerary) {
      await updateItineraryMutation.mutateAsync({
        id: selectedItinerary.id,
        ...values,
      });
    } else {
      await createItineraryMutation.mutateAsync(values);
    }

    setSheetOpen(false);
    setSelectedItinerary(null);
  };

  return (
    <Main>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="font-bold text-4xl">Itineraries</h1>
            <p className="text-muted-foreground">
              Manage tour itineraries, destinations, and schedules here.
            </p>
          </div>
          <Button onClick={openCreateSheet} type="button">
            <PlusIcon data-icon="inline-start" />
            Add itinerary
          </Button>
        </div>
        <ItinerariesTable
          columnVisibility={columnVisibility}
          isLoading={itinerariesQuery.isLoading}
          page={page}
          pageSize={pageSize}
          result={itinerariesQuery.data}
          search={searchInput}
          sorting={sorting}
          onColumnVisibilityChange={setColumnVisibility}
          onEdit={openEditSheet}
          onDelete={handleDelete}
          onDownloadPdf={handleDownloadPdf}
          onPageChange={setPage}
          onPageSizeChange={(value) => {
            setPageSize(value);
            setPage(1);
          }}
          onSearchChange={setSearchInput}
          onSortingChange={(updater) => {
            setSorting((current) =>
              typeof updater === "function" ? updater(current) : updater,
            );
            setPage(1);
          }}
        />
        <ItinerarySheet
          itinerary={selectedItinerary}
          open={sheetOpen}
          onOpenChange={(open) => {
            setSheetOpen(open);
            if (!open) {
              setSelectedItinerary(null);
            }
          }}
          onSubmit={submitItinerary}
        />
      </div>
    </Main>
  );
}

function getItinerarySort(sorting: SortingState): {
  id: "title" | "destination" | "days";
  desc: boolean;
} {
  const sort = sorting[0];

  if (sort?.id === "destination" || sort?.id === "days") {
    return { id: sort.id, desc: sort.desc };
  }

  return { id: "title", desc: sort?.desc ?? false };
}
