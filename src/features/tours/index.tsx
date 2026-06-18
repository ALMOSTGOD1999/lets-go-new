import type { SortingState, VisibilityState } from '@tanstack/react-table';
import { PlusIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Main } from '#/components/layout/main';
import { Button } from '#/components/ui/button';
import { TourSheet } from '#/features/tours/components/tour-sheet';
import { ToursTable } from '#/features/tours/components/tours-table';
import type { Tour, TourFormValues } from '#/features/tours/data/schema';
import {
  useCreateTour,
  useTours,
  useUpdateTour,
} from '#/features/tours/hooks/use-tours';

export function ToursPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'startDate', desc: false },
  ]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedTour, setSelectedTour] = useState<Tour | null>(null);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 500);

    return () => window.clearTimeout(timeoutId);
  }, [searchInput]);

  const sort = getTourSort(sorting);
  const toursQuery = useTours({
    page,
    pageSize,
    search,
    sortBy: sort.id,
    sortDirection: sort.desc ? 'desc' : 'asc',
  });
  const createTourMutation = useCreateTour();
  const updateTourMutation = useUpdateTour();

  const openCreateSheet = () => {
    setSelectedTour(null);
    setSheetOpen(true);
  };

  const openEditSheet = (tour: Tour) => {
    setSelectedTour(tour);
    setSheetOpen(true);
  };

  const submitTour = async (values: TourFormValues) => {
    if (selectedTour) {
      await updateTourMutation.mutateAsync({
        id: selectedTour.id,
        ...values,
      });
    } else {
      await createTourMutation.mutateAsync(values);
    }

    setSheetOpen(false);
    setSelectedTour(null);
  };

  return (
    <Main>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="font-bold text-4xl">Tours</h1>
            <p className="text-muted-foreground">
              Plan tours, dates, and attendees here.
            </p>
          </div>
          <Button onClick={openCreateSheet} type="button">
            <PlusIcon data-icon="inline-start" />
            Add tour
          </Button>
        </div>
        <ToursTable
          columnVisibility={columnVisibility}
          isLoading={toursQuery.isLoading}
          page={page}
          pageSize={pageSize}
          result={toursQuery.data}
          search={searchInput}
          sorting={sorting}
          onColumnVisibilityChange={setColumnVisibility}
          onEdit={openEditSheet}
          onPageChange={setPage}
          onPageSizeChange={(value) => {
            setPageSize(value);
            setPage(1);
          }}
          onSearchChange={setSearchInput}
          onSortingChange={(updater) => {
            setSorting((current) =>
              typeof updater === 'function' ? updater(current) : updater,
            );
            setPage(1);
          }}
        />
        <TourSheet
          open={sheetOpen}
          tour={selectedTour}
          onOpenChange={(open) => {
            setSheetOpen(open);
            if (!open) {
              setSelectedTour(null);
            }
          }}
          onSubmit={submitTour}
        />
      </div>
    </Main>
  );
}

function getTourSort(sorting: SortingState): {
  id: 'name' | 'startDate' | 'endDate';
  desc: boolean;
} {
  const sort = sorting[0];

  if (sort?.id === 'name' || sort?.id === 'endDate') {
    return { id: sort.id, desc: sort.desc };
  }

  return { id: 'startDate', desc: sort?.desc ?? false };
}
