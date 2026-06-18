import { z } from 'zod';

export const clientFormSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  email: z.email('Enter a valid email address'),
  phone: z.string().trim().min(1, 'Phone is required'),
  address: z.string().trim().nullable().default(null),
});

export const listClientsInputSchema = z.object({
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(10),
  search: z.string().default(''),
  sortBy: z.enum(['name', 'email', 'phone']).default('name'),
  sortDirection: z.enum(['asc', 'desc']).default('asc'),
});

export const createClientInputSchema = clientFormSchema;

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
export type ListClientsInput = z.input<typeof listClientsInputSchema>;
export type ClientsListResult = {
  data: Client[];
  page: number;
  pageSize: number;
  total: number;
  pageCount: number;
};
