import type { SortingState, VisibilityState } from "@tanstack/react-table";
import { MailIcon, PlusIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { MasterkeyDialog } from "#/components/masterkey-dialog";
import { Main } from "#/components/layout/main";
import { Button } from "#/components/ui/button";
import {
  ClientEmailSheet,
  type ClientEmailSheetDefaults,
} from "#/features/clients/components/client-email-sheet";
import { ClientSheet } from "#/features/clients/components/client-sheet";
import { ClientsTable } from "#/features/clients/components/clients-table";
import type { Client, ClientFormValues } from "#/features/clients/data/schema";
import {
  useClients,
  useCreateClient,
  useDeleteClient,
  useSendClientEmailCampaign,
  useUpdateClient,
} from "#/features/clients/hooks/use-clients";

export function ClientsPage() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [sorting, setSorting] = useState<SortingState>([
    { id: "name", desc: false },
  ]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [sheetOpen, setSheetOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [emailSheetOpen, setEmailSheetOpen] = useState(false);
  const [emailDefaults, setEmailDefaults] = useState<
    ClientEmailSheetDefaults | undefined
  >();

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
    sortDirection: sort.desc ? "desc" : "asc",
  });
  const createClientMutation = useCreateClient();
  const updateClientMutation = useUpdateClient();
  const deleteClientMutation = useDeleteClient();
  const sendEmailMutation = useSendClientEmailCampaign();
  const [deleteTarget, setDeleteTarget] = useState<Client | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

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

  const openBulkEmailSheet = () => {
    setEmailDefaults({
      audience: "all",
      emailType: "promotional",
      subject: "",
      headline: "",
      message: "",
      audienceLabel: "All clients with email",
    });
    setEmailSheetOpen(true);
  };

  const openClientEmailSheet = (client: Client) => {
    setEmailDefaults({
      audience: "specific",
      clientIds: [client.id],
      emailType: "promotional",
      subject: "",
      headline: "",
      message: `Hello ${client.name},\n\n`,
      audienceLabel: `${client.name} <${client.email}>`,
    });
    setEmailSheetOpen(true);
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

  const handleDeleteClick = (client: Client) => {
    setDeleteTarget(client);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    if (deleteTarget) {
      deleteClientMutation.mutate({ id: deleteTarget.id });
    }
    setDeleteTarget(null);
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
          <div className="flex gap-2">
            <Button onClick={openCreateSheet} type="button">
              <PlusIcon data-icon="inline-start" />
              Add client
            </Button>
            <Button
              onClick={openBulkEmailSheet}
              type="button"
              variant="outline"
            >
              <MailIcon data-icon="inline-start" />
              Send email
            </Button>
          </div>
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
          onDelete={handleDeleteClick}
          onEdit={openEditSheet}
          onSendEmail={openClientEmailSheet}
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
        <ClientEmailSheet
          open={emailSheetOpen}
          defaults={emailDefaults}
          onOpenChange={(open) => {
            setEmailSheetOpen(open);
            if (!open) setEmailDefaults(undefined);
          }}
          onSubmit={async (values) => {
            await sendEmailMutation.mutateAsync(values);
            setEmailSheetOpen(false);
            setEmailDefaults(undefined);
          }}
        />
        <MasterkeyDialog
          open={deleteDialogOpen}
          title="Delete Client"
          description={`Are you sure you want to delete "${deleteTarget?.name ?? ""}"? This action cannot be undone.`}
          onConfirm={handleDeleteConfirm}
          onOpenChange={setDeleteDialogOpen}
        />
      </div>
    </Main>
  );
}

function getClientSort(sorting: SortingState): {
  id: "name" | "email" | "phone";
  desc: boolean;
} {
  const sort = sorting[0];

  if (sort?.id === "email" || sort?.id === "phone") {
    return { id: sort.id, desc: sort.desc };
  }

  return { id: "name", desc: sort?.desc ?? false };
}
