import { z } from "zod";

// ─── Destinations ────────────────────────────────────────────────

export const destinationFormSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  description: z.string().trim().nullable().default(null),
});

export const createDestinationInputSchema = destinationFormSchema;
export const updateDestinationInputSchema = destinationFormSchema.extend({
  id: z.string(),
});

export type Destination = {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
};

// ─── Customers ────────────────────────────────────────────────────

export const customerFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().email("Enter a valid email"),
  phone: z.string().trim().nullable().default(null),
  address: z.string().trim().nullable().default(null),
});

export const createCustomerInputSchema = customerFormSchema;
export const updateCustomerInputSchema = customerFormSchema.extend({
  id: z.string(),
});

export type Customer = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  address: string | null;
  createdAt: Date;
  updatedAt: Date;
};

// ─── Room Types ────────────────────────────────────────────────────

export const roomTypeFormSchema = z.object({
  itineraryId: z.string().min(1, "Itinerary is required"),
  name: z.string().trim().min(1, "Name is required"),
  price: z.number().int().min(0, "Price must be 0 or more"),
  maxPerson: z.number().int().min(1, "Must allow at least 1 person").default(2),
  description: z.string().trim().nullable().default(null),
});

export const createRoomTypeInputSchema = roomTypeFormSchema;
export const updateRoomTypeInputSchema = roomTypeFormSchema.extend({
  id: z.string(),
});

export type RoomType = {
  id: string;
  itineraryId: string;
  name: string;
  price: number;
  maxPerson: number;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
};

// ─── Quotations ────────────────────────────────────────────────────

export const quotationFormSchema = z.object({
  customerId: z.string().min(1, "Customer is required"),
  destinationId: z.string().min(1, "Destination is required"),
  itineraryId: z.string().min(1, "Itinerary is required"),
  roomTypeId: z.string().min(1, "Room type is required"),
  totalPrice: z.number().int().min(0, "Price must be 0 or more"),
  status: z.enum(["draft", "sent", "accepted", "rejected"]).default("draft"),
  notes: z.string().trim().nullable().default(null),
});

export const createQuotationInputSchema = quotationFormSchema;
export const updateQuotationInputSchema = quotationFormSchema.extend({
  id: z.string(),
});

export type Quotation = {
  id: string;
  customerId: string;
  destinationId: string;
  itineraryId: string;
  roomTypeId: string;
  totalPrice: number;
  status: string;
  pdfPath: string | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
};

// ─── Quotation Features ────────────────────────────────────────────

export const quotationFeatureFormSchema = z.object({
  quotationId: z.string().min(1, "Quotation is required"),
  featureName: z.string().trim().min(1, "Feature name is required"),
  description: z.string().trim().nullable().default(null),
});

export const createQuotationFeatureInputSchema = quotationFeatureFormSchema;
export const updateQuotationFeatureInputSchema = quotationFeatureFormSchema.extend({
  id: z.string(),
});

export type QuotationFeature = {
  id: string;
  quotationId: string;
  featureName: string;
  description: string | null;
  createdAt: Date;
  updatedAt: Date;
};

// ─── Do & Don'ts ──────────────────────────────────────────────────

export const doAndDontFormSchema = z.object({
  destinationId: z.string().min(1, "Destination is required"),
  type: z.enum(["do", "dont"]),
  content: z.string().trim().min(1, "Content is required"),
});

export const createDoAndDontInputSchema = doAndDontFormSchema;
export const updateDoAndDontInputSchema = doAndDontFormSchema.extend({
  id: z.string(),
});

export type DoAndDont = {
  id: string;
  destinationId: string;
  type: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
};

// ─── Email Templates ───────────────────────────────────────────────

export const emailTemplateFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  subject: z.string().trim().min(1, "Subject is required"),
  body: z.string().trim().min(1, "Body is required"),
  isActive: z.boolean().default(true),
});

export const createEmailTemplateInputSchema = emailTemplateFormSchema;
export const updateEmailTemplateInputSchema = emailTemplateFormSchema.extend({
  id: z.string(),
});

export type EmailTemplate = {
  id: string;
  name: string;
  subject: string;
  body: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
};

// ─── List Input Helpers ────────────────────────────────────────────

export const listInputSchema = z.object({
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(10),
  search: z.string().default(""),
  sortBy: z.string().default("name"),
  sortDirection: z.enum(["asc", "desc"]).default("asc"),
});

export type ListInput = z.input<typeof listInputSchema>;
export type ListResult<T> = {
  data: T[];
  page: number;
  pageSize: number;
  total: number;
  pageCount: number;
};
