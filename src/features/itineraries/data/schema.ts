import { z } from "zod";

export const itineraryFormSchema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  destination: z.string().trim().min(1, "Destination is required"),
  days: z.number().int().min(1, "Days must be at least 1"),
  nights: z.number().int().min(0, "Nights must be 0 or more"),
  overview: z.string().trim().nullable().default(null),
  price: z.number().int().min(0).nullable().default(null),
  dayDetails: z.array(z.string()).default([]),
});

export const listItinerariesInputSchema = z.object({
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(10),
  search: z.string().default(""),
  sortBy: z.enum(["title", "destination", "days"]).default("title"),
  sortDirection: z.enum(["asc", "desc"]).default("asc"),
});

export const createItineraryInputSchema = itineraryFormSchema;

export const updateItineraryInputSchema = itineraryFormSchema.extend({
  id: z.string(),
});

export type Itinerary = {
  id: string;
  title: string;
  destination: string;
  days: number;
  nights: number;
  overview: string | null;
  price: number | null;
  dayDetails: string[] | null;
  createdAt: Date;
  updatedAt: Date;
};

export type ItineraryFormValues = z.input<typeof itineraryFormSchema>;
export type ListItinerariesInput = z.input<typeof listItinerariesInputSchema>;
export type ItinerariesListResult = {
  data: Itinerary[];
  page: number;
  pageSize: number;
  total: number;
  pageCount: number;
};
