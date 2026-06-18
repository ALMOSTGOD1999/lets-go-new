import { z } from 'zod';

const rupeeIntegerSchema = z.number().int().min(0, 'Enter a positive amount');
const gstPercentSchema = z
  .number()
  .int()
  .min(0, 'GST must be between 0 and 100')
  .max(100, 'GST must be between 0 and 100');

export const tourAttendeeFormSchema = z.object({
  tourId: z.number().int().positive(),
  clientId: z.number().int().positive(),
  adultCount: z.number().int().min(1, 'At least 1 adult is required'),
  childCount: z.number().int().min(0, 'Children cannot be negative'),
  adultCost: rupeeIntegerSchema,
  childCost: rupeeIntegerSchema,
  adultGstPercent: gstPercentSchema,
  childGstPercent: gstPercentSchema,
  discountAmount: rupeeIntegerSchema,
});

export const createTourAttendeeInputSchema = tourAttendeeFormSchema;

export const updateTourAttendeeInputSchema = tourAttendeeFormSchema.extend({
  id: z.number().int().positive(),
});

export type PaymentStatus = 'unpaid' | 'partial' | 'paid' | 'overpaid';

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
  paymentStatus: PaymentStatus;
};

export type TourAttendee = TourAttendeeInput & {
  id: number;
  createdAt: Date;
  updatedAt: Date;
};

export type TourAttendeeWithClient = TourAttendee &
  TourAttendeeBilling & {
    clientName: string;
    clientEmail: string;
    clientPhone: string;
  };

export type TourAttendeeWithTour = TourAttendee &
  TourAttendeeBilling & {
    tourName: string;
    tourStartDate: Date;
    tourEndDate: Date;
    clientName: string;
    clientEmail: string;
    clientPhone: string;
  };

export type TourAttendeeFormValues = z.output<typeof tourAttendeeFormSchema>;
export type TourAttendeeInput = z.output<typeof tourAttendeeFormSchema>;
