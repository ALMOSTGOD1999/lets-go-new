import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type {
  ClientEmailFormValues,
  ClientFormValues,
  ListClientsInput,
} from "#/features/clients/data/schema";
import {
  createClient,
  deleteClient,
  listClients,
  sendClientEmailCampaign,
  updateClient,
} from "#/features/clients/server/functions";

export const clientsQueryKey = (input: ListClientsInput) => ["clients", input];

export function useClients(input: ListClientsInput) {
  return useQuery({
    queryKey: clientsQueryKey(input),
    queryFn: () => listClients({ data: input }),
    enabled: typeof window !== "undefined",
  });
}

export function useCreateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: ClientFormValues) => createClient({ data: input }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast.success("Client saved");
    },
    onError: (error) => {
      toast.error("Unable to save client", {
        description: error.message,
      });
    },
  });
}

export function useUpdateClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: ClientFormValues & { id: number }) =>
      updateClient({ data: input }),
    onSuccess: async (client) => {
      await queryClient.invalidateQueries({ queryKey: ["clients"] });
      await queryClient.invalidateQueries({ queryKey: ["client", client.id] });
      toast.success("Client updated");
    },
    onError: (error) => {
      toast.error("Unable to update client", {
        description: error.message,
      });
    },
  });
}

export function useDeleteClient() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: { id: number }) => deleteClient({ data: input }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["clients"] });
      toast.success("Client deleted");
    },
    onError: (error) => {
      toast.error("Unable to delete client", {
        description: error.message,
      });
    },
  });
}

export function useSendClientEmailCampaign() {
  return useMutation({
    mutationFn: (input: ClientEmailFormValues) =>
      sendClientEmailCampaign({ data: input }),
    onSuccess: (result) => {
      toast.success("Email sent", {
        description: `Delivered to ${result.sentCount} client${result.sentCount === 1 ? "" : "s"}.`,
      });
    },
    onError: (error) => {
      toast.error("Unable to send email", {
        description: error.message,
      });
    },
  });
}
