import { useForm } from '@tanstack/react-form';
import { useEffect } from 'react';

import { Button } from '#/components/ui/button';
import { DateTimePicker } from '#/components/ui/date-time-picker';
import { Field, FieldGroup, FieldLabel } from '#/components/ui/field';
import { Input } from '#/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '#/components/ui/sheet';
import { Textarea } from '#/components/ui/textarea';
import type {
  Reminder,
  ReminderFormValues,
  ReminderType,
} from '#/features/reminders/data/schema';
import {
  reminderFormSchema,
  reminderTypes,
} from '#/features/reminders/data/schema';

export type ReminderDefaults = Partial<ReminderFormValues>;

export function ReminderSheet({
  open,
  reminder,
  defaults,
  onOpenChange,
  onSubmit,
}: {
  open: boolean;
  reminder: Reminder | null;
  defaults?: ReminderDefaults;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: ReminderFormValues) => Promise<void>;
}) {
  const form = useForm({
    defaultValues: getDefaults(reminder, defaults),
    validators: { onChange: reminderFormSchema, onSubmit: reminderFormSchema },
    onSubmit: async ({ value }) => {
      await onSubmit(value);
      form.reset(getDefaults(null, defaults));
    },
  });

  useEffect(() => {
    if (open) form.reset(getDefaults(reminder, defaults));
  }, [open, reminder, defaults, form]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>{reminder ? 'Edit reminder' : 'New reminder'}</SheetTitle>
          <SheetDescription>
            Schedule a browser reminder and keep it visible in the inbox.
          </SheetDescription>
        </SheetHeader>
        <form
          className="flex flex-col gap-4 px-4"
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();
            void form.handleSubmit();
          }}
        >
          <FieldGroup>
            <form.Field name="title">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Title</FieldLabel>
                  <Input
                    id={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                  />
                </Field>
              )}
            </form.Field>
            <form.Field name="message">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Message</FieldLabel>
                  <Textarea
                    id={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                  />
                </Field>
              )}
            </form.Field>
            <form.Field name="scheduledAt">
              {(field) => (
                <DateTimePicker
                  label="Scheduled at"
                  id={field.name}
                  value={field.state.value}
                  onChange={(value) => field.handleChange(value)}
                />
              )}
            </form.Field>
            <form.Field name="type">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Type</FieldLabel>
                  <Select
                    value={field.state.value}
                    onValueChange={(value) =>
                      field.handleChange(value as ReminderType)
                    }
                  >
                    <SelectTrigger id={field.name} className="w-full">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {reminderTypes.map((type) => (
                          <SelectItem key={type} value={type}>
                            {formatType(type)}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
              )}
            </form.Field>
            <form.Field name="relatedLabel">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Related entity</FieldLabel>
                  <Input
                    id={field.name}
                    placeholder="Client, tour, receipt, voucher..."
                    value={field.state.value ?? ''}
                    onBlur={field.handleBlur}
                    onChange={(event) =>
                      field.handleChange(event.target.value || null)
                    }
                  />
                </Field>
              )}
            </form.Field>
            <form.Field name="notes">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Notes</FieldLabel>
                  <Textarea
                    id={field.name}
                    value={field.state.value ?? ''}
                    onBlur={field.handleBlur}
                    onChange={(event) =>
                      field.handleChange(event.target.value || null)
                    }
                  />
                </Field>
              )}
            </form.Field>
          </FieldGroup>
          <SheetFooter className="px-4 pb-4">
            <Button type="submit">
              {reminder ? 'Save changes' : 'Create reminder'}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}

function getDefaults(
  reminder: Reminder | null,
  defaults?: ReminderDefaults,
): ReminderFormValues {
  if (reminder) {
    return {
      title: reminder.title,
      message: reminder.message,
      scheduledAt: toDateTimeInputValue(reminder.scheduledAt),
      type: reminder.type,
      relatedEntityType: reminder.relatedEntityType,
      relatedEntityId: reminder.relatedEntityId,
      relatedLabel: reminder.relatedLabel,
      targetPath: reminder.targetPath,
      notes: reminder.notes,
    };
  }

  return {
    title: defaults?.title ?? '',
    message: defaults?.message ?? '',
    scheduledAt: defaults?.scheduledAt ?? toDateTimeInputValue(defaultDate()),
    type: defaults?.type ?? 'general',
    relatedEntityType: defaults?.relatedEntityType ?? null,
    relatedEntityId: defaults?.relatedEntityId ?? null,
    relatedLabel: defaults?.relatedLabel ?? null,
    targetPath: defaults?.targetPath ?? '/reminders',
    notes: defaults?.notes ?? null,
  };
}

function defaultDate() {
  const date = new Date();
  date.setMinutes(date.getMinutes() + 30);
  date.setSeconds(0, 0);
  return date;
}

function toDateTimeInputValue(value: Date | string) {
  const date = value instanceof Date ? value : new Date(value);
  return new Date(date.getTime() + 5.5 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 16);
}

function formatType(type: ReminderType) {
  return type.charAt(0).toUpperCase() + type.slice(1);
}
