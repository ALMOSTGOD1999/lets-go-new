import type { SortingState, VisibilityState } from '@tanstack/react-table';
import { PlusIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Main } from '#/components/layout/main';
import { Button } from '#/components/ui/button';
import { ClientSheet } from '#/features/clients/components/client-sheet';
import { ClientsTable } from '#/features/clients/components/clients-table';
import type { Client, ClientFormValues } from '#/features/clients/data/schema';
import {
  useClients,
  useCreateClient,
  useUpdateClient,
} from '#/features/clients/hooks/use-clients';

export function ClientsPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [sorting, setSorting] = useState<SortingState>([
    { id: 'name', desc: false },
  ]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      setSearch(searchInput);
      setPage(1);
    }, 500);

    return () => window.clearTimeout(timeoutId);
  }, [searchInput]);

  const sort = getClientSort(sorting);
  const clientsQuery = useClients({
    page,
    pageSize,
    search,
    sortBy: sort.id,
    sortDirection: sort.desc ? 'desc' : 'asc',
  });
  const createClientMutation = useCreateClient();
  const updateClientMutation = useUpdateClient();

  useEffect(() => {
    const pageCount = clientsQuery.data?.pageCount;

    if (pageCount && page > pageCount) {
      setPage(pageCount);
    }
  }, [clientsQuery.data?.pageCount, page]);

  const openCreateSheet = () => {
    setSelectedClient(null);
    setSheetOpen(true);
  };

  const openEditSheet = (client: Client) => {
    setSelectedClient(client);
    setSheetOpen(true);
  };

  const submitClient = async (values: ClientFormValues) => {
    if (selectedClient) {
      await updateClientMutation.mutateAsync({
        id: selectedClient.id,
        ...values,
      });
    } else {
      await createClientMutation.mutateAsync(values);
    }

    setSheetOpen(false);
    setSelectedClient(null);
  };

  return (
    <Main>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-2">
            <h1 className="font-bold text-4xl">Clients</h1>
            <p className="text-muted-foreground">
              Manage traveler profiles and contact details here.
            </p>
          </div>
          <Button onClick={openCreateSheet} type="button">
            <PlusIcon data-icon="inline-start" />
            Add client
          </Button>
        </div>
        <ClientsTable
          columnVisibility={columnVisibility}
          isLoading={clientsQuery.isLoading}
          page={page}
          pageSize={pageSize}
          result={clientsQuery.data}
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
        <ClientSheet
          client={selectedClient}
          open={sheetOpen}
          onOpenChange={(open) => {
            setSheetOpen(open);
            if (!open) {
              setSelectedClient(null);
            }
          }}
          onSubmit={submitClient}
        />
      </div>
    </Main>
  );
}

function getClientSort(sorting: SortingState): {
  id: 'name' | 'email' | 'phone';
  desc: boolean;
} {
  const sort = sorting[0];

  if (sort?.id === 'email' || sort?.id === 'phone') {
    return { id: sort.id, desc: sort.desc };
  }

  return { id: 'name', desc: sort?.desc ?? false };
}
