import { z } from 'zod';

export const tourFormSchema = z
  .object({
    name: z.string().trim().min(1, 'Name is required'),
    description: z.string().trim().optional(),
    startDate: z.iso.date('Start date is required'),
    endDate: z.iso.date('End date is required'),
  })
  .refine((value) => value.endDate >= value.startDate, {
    message: 'End date must be on or after start date',
    path: ['endDate'],
  });

export const listToursInputSchema = z.object({
  page: z.number().int().min(1).default(1),
  pageSize: z.number().int().min(1).max(100).default(10),
  search: z.string().default(''),
  sortBy: z.enum(['name', 'startDate', 'endDate']).default('startDate'),
  sortDirection: z.enum(['asc', 'desc']).default('asc'),
});

export const createTourInputSchema = tourFormSchema;

export const updateTourInputSchema = tourFormSchema.extend({
  id: z.number().int().positive(),
});

export type Tour = {
  id: number;
  name: string;
  description: string | null;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
  attendeeCount: number;
};

export type TourAttendee = {
  id: number;
  tourId: number;
  clientId: number;
  adultCount: number;
  childCount: number;
  adultCost: number;
  childCost: number;
  adultGstPercent: number;
  childGstPercent: number;
  discountAmount: number;
  createdAt: Date;
  updatedAt: Date;
};

export type TourAttendeeBilling = {
  adultBase: number;
  childBase: number;
  adultGstAmount: number;
  childGstAmount: number;
  subtotal: number;
  gstTotal: number;
  grossTotal: number;
  finalTotal: number;
  receivedAmount: number;
  balanceAmount: number;
  paymentStatus: 'unpaid' | 'partial' | 'paid' | 'overpaid';
};

export type TourFormValues = z.input<typeof tourFormSchema>;
export type ListToursInput = z.input<typeof listToursInputSchema>;
export type ToursListResult = {
  data: Tour[];
  page: number;
  pageSize: number;
  total: number;
  pageCount: number;
};
