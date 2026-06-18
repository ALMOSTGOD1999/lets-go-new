import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import type {
  ItineraryFormValues,
  ListItinerariesInput,
} from "#/features/itineraries/data/schema";
import {
  createItinerary,
  deleteItinerary,
  listItineraries,
  updateItinerary,
} from "#/features/itineraries/server/functions";

export const itinerariesQueryKey = (input: ListItinerariesInput) => [
  "itineraries",
  input,
];

export function useItineraries(input: ListItinerariesInput) {
  return useQuery({
    queryKey: itinerariesQueryKey(input),
    queryFn: () => listItineraries({ data: input }),
    enabled: typeof window !== "undefined",
  });
}

export function useCreateItinerary() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: ItineraryFormValues) =>
      createItinerary({ data: input }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["itineraries"] });
      toast.success("Itinerary saved");
    },
    onError: (error) => {
      toast.error("Unable to save itinerary", {
        description: error.message,
      });
    },
  });
}

export function useUpdateItinerary() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: ItineraryFormValues & { id: string }) =>
      updateItinerary({ data: input }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["itineraries"] });
      toast.success("Itinerary updated");
    },
    onError: (error) => {
      toast.error("Unable to update itinerary", {
        description: error.message,
      });
    },
  });
}

export function useDeleteItinerary() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteItinerary({ data: { id } }),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["itineraries"] });
      toast.success("Itinerary deleted");
    },
    onError: (error) => {
      toast.error("Unable to delete itinerary", {
        description: error.message,
      });
    },
  });
}
