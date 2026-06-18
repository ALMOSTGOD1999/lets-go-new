import { useForm } from '@tanstack/react-form';
import { CalendarIcon } from 'lucide-react';
import { type ComponentProps, useEffect, useState } from 'react';

import { Button } from '#/components/ui/button';
import { Calendar } from '#/components/ui/calendar';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '#/components/ui/field';
import { Input } from '#/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '#/components/ui/popover';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '#/components/ui/sheet';
import { Spinner } from '#/components/ui/spinner';
import { Textarea } from '#/components/ui/textarea';
import type { Tour, TourFormValues } from '#/features/tours/data/schema';
import { tourFormSchema } from '#/features/tours/data/schema';
import { cn } from '#/lib/utils';

type TourSheetProps = {
  tour: Tour | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: TourFormValues) => Promise<void>;
};

export function TourSheet({
  tour,
  open,
  onOpenChange,
  onSubmit,
}: TourSheetProps) {
  const form = useForm({
    defaultValues: getDefaultValues(tour),
    validators: {
      onChange: tourFormSchema,
      onSubmit: tourFormSchema,
    },
    onSubmit: async ({ value }) => {
      await onSubmit(value);
      form.reset(getDefaultValues(null));
    },
  });

  const title = tour ? 'Edit tour' : 'Create tour';
  const description = tour
    ? 'Update tour details and travel dates.'
    : 'Add a new tour with travel dates.';

  useEffect(() => {
    if (open) {
      form.reset(getDefaultValues(tour));
    }
  }, [form, open, tour]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>
        <form
          id="tour-form"
          className="flex flex-1 flex-col gap-4 px-4"
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();
            void form.handleSubmit();
          }}
        >
          <FieldGroup>
            <form.Field name="name">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Name</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      aria-invalid={isInvalid}
                      aria-label="Tour name"
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                    />
                    {isInvalid ? (
                      <FieldError errors={field.state.meta.errors} />
                    ) : null}
                  </Field>
                );
              }}
            </form.Field>
            <form.Field name="description">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Description</FieldLabel>
                    <Textarea
                      id={field.name}
                      name={field.name}
                      value={field.state.value ?? ''}
                      aria-invalid={isInvalid}
                      aria-label="Tour description"
                      onBlur={field.handleBlur}
                      onChange={(event) =>
                        field.handleChange(event.target.value)
                      }
                    />
                    {isInvalid ? (
                      <FieldError errors={field.state.meta.errors} />
                    ) : null}
                  </Field>
                );
              }}
            </form.Field>
            <form.Field name="startDate">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <TourDatePicker
                    id={field.name}
                    label="Start date"
                    value={field.state.value}
                    errors={field.state.meta.errors}
                    isInvalid={isInvalid}
                    onBlur={field.handleBlur}
                    onChange={field.handleChange}
                  />
                );
              }}
            </form.Field>
            <form.Field name="endDate">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <TourDatePicker
                    id={field.name}
                    label="End date"
                    value={field.state.value}
                    errors={field.state.meta.errors}
                    isInvalid={isInvalid}
                    onBlur={field.handleBlur}
                    onChange={field.handleChange}
                  />
                );
              }}
            </form.Field>
          </FieldGroup>
        </form>
        <SheetFooter>
          <form.Subscribe
            selector={(state) => [
              state.canSubmit,
              state.isSubmitting,
              state.isPristine,
            ]}
          >
            {([canSubmit, isSubmitting, isPristine]) => (
              <Button
                disabled={!canSubmit || isSubmitting || isPristine}
                form="tour-form"
                type="submit"
              >
                {isSubmitting ? <Spinner data-icon="inline-start" /> : null}
                {tour ? 'Save changes' : 'Create tour'}
              </Button>
            )}
          </form.Subscribe>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

type TourDatePickerProps = {
  id: string;
  label: string;
  value: string;
  errors: ComponentProps<typeof FieldError>['errors'];
  isInvalid: boolean;
  onBlur: () => void;
  onChange: (value: string) => void;
};

function TourDatePicker({
  id,
  label,
  value,
  errors,
  isInvalid,
  onBlur,
  onChange,
}: TourDatePickerProps) {
  const [open, setOpen] = useState(false);
  const selectedDate = parseDateInputValue(value);

  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          render={
            <Button
              id={id}
              aria-invalid={isInvalid}
              aria-label={label}
              className={cn(
                'w-full justify-start text-left font-normal',
                !selectedDate && 'text-muted-foreground',
              )}
              onBlur={onBlur}
              type="button"
              variant="outline"
            />
          }
        >
          <CalendarIcon data-icon="inline-start" />
          {selectedDate ? formatDisplayDate(selectedDate) : `Select ${label}`}
        </PopoverTrigger>
        <PopoverContent align="start" className="w-auto p-0">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => {
              if (!date) {
                return;
              }

              onChange(toDateInputValue(date));
              onBlur();
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
      {isInvalid ? <FieldError errors={errors} /> : null}
    </Field>
  );
}

function getDefaultValues(tour: Tour | null): TourFormValues {
  return {
    name: tour?.name ?? '',
    description: tour?.description ?? '',
    startDate: tour ? toDateInputValue(tour.startDate) : '',
    endDate: tour ? toDateInputValue(tour.endDate) : '',
  };
}

function toDateInputValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function parseDateInputValue(value: string) {
  if (!value) {
    return undefined;
  }

  const [year, month, day] = value.split('-').map(Number);

  if (!year || !month || !day) {
    return undefined;
  }

  return new Date(year, month - 1, day);
}

function formatDisplayDate(date: Date) {
  return new Intl.DateTimeFormat('en', { dateStyle: 'medium' }).format(date);
}
