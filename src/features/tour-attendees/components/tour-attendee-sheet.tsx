import { useForm } from '@tanstack/react-form';
import { type ComponentProps, useEffect } from 'react';

import { Button } from '#/components/ui/button';
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '#/components/ui/field';
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
import { Spinner } from '#/components/ui/spinner';
import type { Client } from '#/features/clients/data/schema';
import type {
  TourAttendeeFormValues,
  TourAttendeeWithClient,
  TourAttendeeWithTour,
} from '#/features/tour-attendees/data/schema';
import { tourAttendeeFormSchema } from '#/features/tour-attendees/data/schema';
import type { Tour } from '#/features/tours/data/schema';

type AttendeeSheetBooking = TourAttendeeWithClient | TourAttendeeWithTour;
type TourOption = Pick<Tour, 'id' | 'name' | 'startDate' | 'endDate'>;

type TourAttendeeSheetProps = {
  open: boolean;
  attendee: AttendeeSheetBooking | null;
  clients?: Client[];
  tours?: TourOption[];
  defaultTourId?: number;
  defaultClientId?: number;
  mode?: 'tour' | 'client';
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: TourAttendeeFormValues) => Promise<void>;
};

export function TourAttendeeSheet({
  open,
  attendee,
  clients = [],
  tours = [],
  defaultTourId,
  defaultClientId,
  mode = 'tour',
  onOpenChange,
  onSubmit,
}: TourAttendeeSheetProps) {
  const defaultValues = getDefaultValues(
    attendee,
    defaultTourId,
    defaultClientId,
  );
  const form = useForm({
    defaultValues,
    validators: {
      onChange: tourAttendeeFormSchema,
      onSubmit: tourAttendeeFormSchema,
    },
    onSubmit: async ({ value }) => {
      await onSubmit(value);
      form.reset(getDefaultValues(null, defaultTourId, defaultClientId));
    },
  });

  const title = attendee
    ? 'Edit booking'
    : mode === 'client'
      ? 'Assign tour'
      : 'Add attendee';
  const description = attendee
    ? 'Update pricing for this booking.'
    : mode === 'client'
      ? 'Select an existing tour and add booking pricing for this client.'
      : 'Select an existing client and add booking pricing for this tour.';

  useEffect(() => {
    if (open) {
      form.reset(getDefaultValues(attendee, defaultTourId, defaultClientId));
    }
  }, [attendee, defaultClientId, defaultTourId, form, open]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>
        <form
          id="tour-attendee-form"
          className="flex flex-1 flex-col gap-4 px-4"
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();
            void form.handleSubmit();
          }}
        >
          <FieldGroup>
            {mode === 'client' ? (
              <form.Field name="tourId">
                {(field) => {
                  const isInvalid = isFieldInvalid(field.state.meta);

                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Tour</FieldLabel>
                      {attendee && 'tourName' in attendee ? (
                        <Input
                          id={field.name}
                          aria-invalid={isInvalid}
                          disabled
                          value={attendee.tourName}
                        />
                      ) : (
                        <Select
                          value={
                            field.state.value > 0
                              ? String(field.state.value)
                              : ''
                          }
                          onValueChange={(value) => {
                            field.handleChange(Number(value));
                          }}
                        >
                          <SelectTrigger
                            id={field.name}
                            aria-invalid={isInvalid}
                            className="w-full"
                          >
                            <SelectValue placeholder="Select tour">
                              {(value) =>
                                getTourSelectLabel(tours, value) ??
                                'Select tour'
                              }
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {tours.map((tour) => (
                                <SelectItem
                                  key={tour.id}
                                  value={String(tour.id)}
                                >
                                  {tour.name}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      )}
                      {tours.length === 0 && !attendee ? (
                        <FieldDescription>
                          No available tours. This client is already assigned to
                          all active tours.
                        </FieldDescription>
                      ) : null}
                      {isInvalid ? (
                        <FieldError errors={field.state.meta.errors} />
                      ) : null}
                    </Field>
                  );
                }}
              </form.Field>
            ) : (
              <form.Field name="clientId">
                {(field) => {
                  const isInvalid = isFieldInvalid(field.state.meta);

                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Client</FieldLabel>
                      {attendee ? (
                        <Input
                          id={field.name}
                          aria-invalid={isInvalid}
                          disabled
                          value={attendee.clientName}
                        />
                      ) : (
                        <Select
                          value={
                            field.state.value > 0
                              ? String(field.state.value)
                              : ''
                          }
                          onValueChange={(value) => {
                            field.handleChange(Number(value));
                          }}
                        >
                          <SelectTrigger
                            id={field.name}
                            aria-invalid={isInvalid}
                            className="w-full"
                          >
                            <SelectValue placeholder="Select client">
                              {(value) =>
                                getClientSelectLabel(clients, value) ??
                                'Select client'
                              }
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectGroup>
                              {clients.map((client) => (
                                <SelectItem
                                  key={client.id}
                                  value={String(client.id)}
                                >
                                  {client.name}
                                </SelectItem>
                              ))}
                            </SelectGroup>
                          </SelectContent>
                        </Select>
                      )}
                      {clients.length === 0 && !attendee ? (
                        <FieldDescription>
                          No available clients. Add a client first or all
                          clients are already added to this tour.
                        </FieldDescription>
                      ) : null}
                      {isInvalid ? (
                        <FieldError errors={field.state.meta.errors} />
                      ) : null}
                    </Field>
                  );
                }}
              </form.Field>
            )}

            <div className="grid gap-4 sm:grid-cols-2">
              <form.Field name="adultCount">
                {(field) => (
                  <NumberField
                    errors={field.state.meta.errors}
                    id={field.name}
                    isInvalid={isFieldInvalid(field.state.meta)}
                    label="Adult count"
                    min={1}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={field.handleChange}
                  />
                )}
              </form.Field>
              <form.Field name="childCount">
                {(field) => (
                  <NumberField
                    errors={field.state.meta.errors}
                    id={field.name}
                    isInvalid={isFieldInvalid(field.state.meta)}
                    label="Child count"
                    min={0}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={field.handleChange}
                  />
                )}
              </form.Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <form.Field name="adultCost">
                {(field) => (
                  <NumberField
                    errors={field.state.meta.errors}
                    id={field.name}
                    isInvalid={isFieldInvalid(field.state.meta)}
                    label="Adult cost per head"
                    min={0}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={field.handleChange}
                  />
                )}
              </form.Field>
              <form.Field name="adultGstPercent">
                {(field) => (
                  <NumberField
                    errors={field.state.meta.errors}
                    id={field.name}
                    isInvalid={isFieldInvalid(field.state.meta)}
                    label="Adult GST %"
                    max={100}
                    min={0}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={field.handleChange}
                  />
                )}
              </form.Field>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <form.Field name="childCost">
                {(field) => (
                  <NumberField
                    errors={field.state.meta.errors}
                    id={field.name}
                    isInvalid={isFieldInvalid(field.state.meta)}
                    label="Child cost per head"
                    min={0}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={field.handleChange}
                  />
                )}
              </form.Field>
              <form.Field name="childGstPercent">
                {(field) => (
                  <NumberField
                    errors={field.state.meta.errors}
                    id={field.name}
                    isInvalid={isFieldInvalid(field.state.meta)}
                    label="Child GST %"
                    max={100}
                    min={0}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={field.handleChange}
                  />
                )}
              </form.Field>
            </div>

            <form.Field name="discountAmount">
              {(field) => (
                <NumberField
                  errors={field.state.meta.errors}
                  id={field.name}
                  isInvalid={isFieldInvalid(field.state.meta)}
                  label="Discount amount"
                  min={0}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={field.handleChange}
                />
              )}
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
                form="tour-attendee-form"
                type="submit"
              >
                {isSubmitting ? <Spinner data-icon="inline-start" /> : null}
                {attendee ? 'Save changes' : 'Create booking'}
              </Button>
            )}
          </form.Subscribe>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

type NumberFieldProps = {
  id: string;
  label: string;
  value: number;
  min: number;
  max?: number;
  errors: ComponentProps<typeof FieldError>['errors'];
  isInvalid: boolean;
  onBlur: () => void;
  onChange: (value: number) => void;
};

function NumberField({
  id,
  label,
  value,
  min,
  max,
  errors,
  isInvalid,
  onBlur,
  onChange,
}: NumberFieldProps) {
  return (
    <Field data-invalid={isInvalid}>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Input
        id={id}
        aria-invalid={isInvalid}
        min={min}
        max={max}
        type="number"
        value={value}
        onBlur={onBlur}
        onChange={(event) => onChange(Number(event.target.value))}
      />
      {isInvalid ? <FieldError errors={errors} /> : null}
    </Field>
  );
}

function getDefaultValues(
  attendee: AttendeeSheetBooking | null,
  tourId?: number,
  clientId?: number,
): TourAttendeeFormValues {
  return {
    tourId: attendee?.tourId ?? tourId ?? 0,
    clientId: attendee?.clientId ?? clientId ?? 0,
    adultCount: attendee?.adultCount ?? 1,
    childCount: attendee?.childCount ?? 0,
    adultCost: attendee?.adultCost ?? 0,
    childCost: attendee?.childCost ?? 0,
    adultGstPercent: attendee?.adultGstPercent ?? 5,
    childGstPercent: attendee?.childGstPercent ?? 5,
    discountAmount: attendee?.discountAmount ?? 0,
  };
}

function getClientSelectLabel(clients: Client[], value: unknown) {
  return clients.find((client) => String(client.id) === String(value))?.name;
}

function getTourSelectLabel(tours: TourOption[], value: unknown) {
  return tours.find((tour) => String(tour.id) === String(value))?.name;
}

function isFieldInvalid(meta: { isTouched: boolean; isValid: boolean }) {
  return meta.isTouched && !meta.isValid;
}
