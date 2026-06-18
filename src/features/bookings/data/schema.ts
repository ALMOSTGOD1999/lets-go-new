import { z } from "zod";

export const receiptMethodSchema = z.enum([
  "Cash",
  "UPI",
  "Bank Transfer",
  "Card",
  "Other",
]);

export const receiptFormSchema = z.object({
  id: z.number().int().positive().optional(),
  attendeeId: z.number().int().positive(),
  date: z.string().min(1, "Receipt date is required"),
  amount: z.number().int().min(1, "Amount must be at least ₹1"),
  method: receiptMethodSchema,
  methodInfo: z.string().trim().max(255).nullable().optional(),
});

export const voucherTypeSchema = z.enum(["hotel", "package", "vehicle"]);
export type VoucherType = z.output<typeof voucherTypeSchema>;

export const voucherFormSchema = z
  .object({
    id: z.number().int().positive().optional(),
    attendeeId: z.number().int().positive(),
    voucherType: voucherTypeSchema,
    bookingId: z.string().trim().max(64).nullable().optional(),
    date: z.string().min(1, "Issue date is required"),
    serviceType: z.string().trim().min(1, "Service type is required"),
    propertyName: z.string().trim().min(1, "Name is required"),
    address: z.string().trim().nullable().optional(),
    checkinDate: z.string().nullable().optional(),
    checkoutDate: z.string().nullable().optional(),
    subBookingType: z.string().trim().nullable().optional(),
    meal: z.string().trim().nullable().optional(),
    payment: z.string().trim().nullable().optional(),
    confirmedBy: z.string().trim().nullable().optional(),
    serviceContact: z.string().trim().nullable().optional(),
    confirmerContact: z.string().trim().nullable().optional(),
    remarks: z.string().trim().nullable().optional(),
  })
  .refine(
    (v) => !v.checkinDate || !v.checkoutDate || v.checkoutDate >= v.checkinDate,
    {
      path: ["checkoutDate"],
      message: "Checkout must be on or after check-in",
    },
  );

export type VoucherFormValues = z.output<typeof voucherFormSchema>;
export type ReceiptMethod = z.output<typeof receiptMethodSchema>;
export type ReceiptFormValues = z.output<typeof receiptFormSchema>;

export type Receipt = {
  id: number;
  attendeeId: number;
  date: Date;
  amount: number;
  method: ReceiptMethod;
  methodInfo: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type Voucher = {
  id: number;
  attendeeId: number;
  voucherType: VoucherType;
  bookingId: string | null;
  date: Date;
  serviceType: string;
  propertyName: string;
  address: string | null;
  checkinDate: Date | null;
  checkoutDate: Date | null;
  subBookingType: string | null;
  meal: string | null;
  payment: string | null;
  confirmedBy: string | null;
  serviceContact: string | null;
  confirmerContact: string | null;
  remarks: string | null;
  createdAt: Date;
  updatedAt: Date;
};
