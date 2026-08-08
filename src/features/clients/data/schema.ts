import { z } from "zod";

export const clientFormSchema = z.object({
  name: z.string().trim().min(1, "Name is required"),
  email: z.string().email("Enter a valid email address"),
  phone: z.string().trim().min(1, "Phone is required"),
  address: z.string().trim().nullable().default(null),
});

export const listClientsInputSchema = z.object({
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(10),
  search: z.string().default(""),
  sortBy: z.enum(["name", "email", "phone"]).default("name"),
  sortDirection: z.enum(["asc", "desc"]).default("asc"),
});

export const createClientInputSchema = clientFormSchema;

export const clientEmailAudienceSchema = z.enum([
  "all",
  "filtered",
  "specific",
]);
export const clientEmailTypeSchema = z.enum(["promotional", "reminder"]);

export const clientEmailFormSchema = z
  .object({
    audience: clientEmailAudienceSchema,
    clientIds: z.array(z.number().int().positive()).default([]),
    search: z.string().default(""),
    emailType: clientEmailTypeSchema,
    subject: z.string().trim().min(1, "Subject is required"),
    headline: z.string().trim().min(1, "Headline is required"),
    message: z.string().trim().min(1, "Message is required"),
    ctaLabel: z.string().trim().max(60).nullable().optional(),
    ctaUrl: z
      .union([z.string().trim().url("Enter a valid CTA URL"), z.literal("")])
      .nullable()
      .optional(),
  })
  .refine(
    (value) => {
      const hasLabel = !!value.ctaLabel?.trim();
      const hasUrl = !!value.ctaUrl?.trim();
      return hasLabel === hasUrl;
    },
    {
      path: ["ctaUrl"],
      message: "Add both CTA label and URL, or leave both empty",
    },
  );

export const updateClientInputSchema = clientFormSchema.extend({
  id: z.number().int().positive(),
});

export type Client = {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string | null;
  createdAt: Date;
  updatedAt: Date;
  bookingCount: number;
};

export type ClientFormValues = z.input<typeof clientFormSchema>;
export type ClientEmailFormValues = z.input<typeof clientEmailFormSchema>;
export type ClientEmailAudience = z.output<typeof clientEmailAudienceSchema>;
export type ClientEmailType = z.output<typeof clientEmailTypeSchema>;
export type ListClientsInput = z.input<typeof listClientsInputSchema>;
export type ClientsListResult = {
  data: Client[];
  page: number;
  pageSize: number;
  total: number;
  pageCount: number;
};
