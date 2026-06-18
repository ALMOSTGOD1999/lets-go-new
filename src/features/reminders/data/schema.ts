import { z } from 'zod';

export const reminderTypes = [
  'receipt',
  'voucher',
  'attendee',
  'general',
] as const;
export const reminderStatuses = [
  'upcoming',
  'sent',
  'failed',
  'cancelled',
] as const;

export const reminderFormSchema = z.object({
  title: z.string().trim().min(1, 'Enter a title'),
  message: z.string().trim().min(1, 'Enter a message'),
  scheduledAt: z.string().min(1, 'Choose date and time'),
  type: z.enum(reminderTypes),
  relatedEntityType: z.string().trim().nullable().optional(),
  relatedEntityId: z.number().int().positive().nullable().optional(),
  relatedLabel: z.string().trim().nullable().optional(),
  targetPath: z.string().trim().min(1),
  notes: z.string().trim().nullable().optional(),
});

export const updateReminderSchema = reminderFormSchema.extend({
  id: z.number().int().positive(),
});

export type ReminderType = (typeof reminderTypes)[number];
export type ReminderStatus = (typeof reminderStatuses)[number];
export type ReminderFormValues = z.output<typeof reminderFormSchema>;

export type Reminder = Omit<ReminderFormValues, 'scheduledAt'> & {
  id: number;
  scheduledAt: Date;
  timezone: string;
  status: ReminderStatus;
  sentAt: Date | null;
  failedAt: Date | null;
  cancelledAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
};
