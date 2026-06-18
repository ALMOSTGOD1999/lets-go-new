import { useForm } from "@tanstack/react-form";
import { useEffect } from "react";

import { Button } from "#/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "#/components/ui/field";
import { Input } from "#/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "#/components/ui/sheet";
import { Spinner } from "#/components/ui/spinner";
import { Textarea } from "#/components/ui/textarea";
import type {
  Itinerary,
  ItineraryFormValues,
} from "#/features/itineraries/data/schema";
import { itineraryFormSchema } from "#/features/itineraries/data/schema";

type ItinerarySheetProps = {
  itinerary: Itinerary | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: ItineraryFormValues) => Promise<void>;
};

export function ItinerarySheet({
  itinerary,
  open,
  onOpenChange,
  onSubmit,
}: ItinerarySheetProps) {
  const form = useForm({
    defaultValues: getDefaultValues(itinerary),
    validators: {
      onChange: itineraryFormSchema,
      onSubmit: itineraryFormSchema,
    },
    onSubmit: async ({ value }) => {
      await onSubmit(value);
      form.reset(getDefaultValues(null));
    },
  });

  const title = itinerary ? "Edit itinerary" : "Create itinerary";
  const description = itinerary
    ? "Update the itinerary details and day-by-day plan."
    : "Add a new itinerary with destination, schedule and day-by-day plan.";

  useEffect(() => {
    if (open) {
      form.reset(getDefaultValues(itinerary));
    }
  }, [itinerary, form, open]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="flex flex-col overflow-y-auto sm:max-w-lg">
        <SheetHeader>
          <SheetTitle>{title}</SheetTitle>
          <SheetDescription>{description}</SheetDescription>
        </SheetHeader>

        <form
          id="itinerary-form"
          className="flex flex-1 flex-col gap-4 px-4"
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();
            void form.handleSubmit();
          }}
        >
          <FieldGroup>
            {/* Title */}
            <form.Field name="title">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Title</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      aria-invalid={isInvalid}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>

            {/* Destination */}
            <form.Field name="destination">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Destination</FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      value={field.state.value}
                      aria-invalid={isInvalid}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>

            {/* Days + Nights side by side */}
            <div className="grid grid-cols-2 gap-3">
              <form.Field name="days">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Days</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="number"
                        min={1}
                        value={field.state.value}
                        aria-invalid={isInvalid}
                        onBlur={field.handleBlur}
                        onChange={(e) => {
                          const n = Math.max(1, parseInt(e.target.value) || 1);
                          field.handleChange(n);
                          // Keep dayDetails array length in sync
                          const curr: string[] =
                            (form.store.state.values as ItineraryFormValues)
                              .dayDetails ?? [];
                          form.setFieldValue(
                            "dayDetails",
                            Array.from({ length: n }, (_, i) => curr[i] ?? ""),
                          );
                        }}
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>

              <form.Field name="nights">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;
                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Nights</FieldLabel>
                      <Input
                        id={field.name}
                        name={field.name}
                        type="number"
                        min={0}
                        value={field.state.value}
                        aria-invalid={isInvalid}
                        onBlur={field.handleBlur}
                        onChange={(e) =>
                          field.handleChange(Number(e.target.value))
                        }
                      />
                      {isInvalid && (
                        <FieldError errors={field.state.meta.errors} />
                      )}
                    </Field>
                  );
                }}
              </form.Field>
            </div>

            {/* Price */}
            <form.Field name="price">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      Price per person (optional)
                    </FieldLabel>
                    <Input
                      id={field.name}
                      name={field.name}
                      type="number"
                      min={0}
                      placeholder="Leave empty if not set"
                      value={field.state.value ?? ""}
                      aria-invalid={isInvalid}
                      onBlur={field.handleBlur}
                      onChange={(e) =>
                        field.handleChange(
                          e.target.value === "" ? null : Number(e.target.value),
                        )
                      }
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>

            {/* Overview */}
            <form.Field name="overview">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;
                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>
                      Overview (optional)
                    </FieldLabel>
                    <Textarea
                      id={field.name}
                      name={field.name}
                      value={field.state.value ?? ""}
                      aria-invalid={isInvalid}
                      onBlur={field.handleBlur}
                      onChange={(e) =>
                        field.handleChange(e.target.value || null)
                      }
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>
          </FieldGroup>

          {/* ── Day-by-day plan ────────────────────────────────────────────── */}
          <div className="flex flex-col gap-1">
            <p className="font-semibold text-sm">Day-by-Day Plan</p>
            <p className="text-muted-foreground text-xs">
              Add sightseeing, activities, or notes for each day.
            </p>
          </div>

          <form.Subscribe selector={(state) => state.values.days}>
            {(daysCount) => (
              <form.Field name="dayDetails">
                {(field) => (
                  <FieldGroup>
                    {Array.from({ length: daysCount ?? 1 }, (_, i) => (
                      <Field key={i}>
                        <FieldLabel htmlFor={`day-detail-${i}`}>
                          Day {i + 1}
                        </FieldLabel>
                        <Textarea
                          id={`day-detail-${i}`}
                          placeholder={`Sightseeing, activities, meals for Day ${i + 1}...`}
                          value={(field.state.value ?? [])[i] ?? ""}
                          onBlur={field.handleBlur}
                          onChange={(e) => {
                            const arr = Array.from(
                              { length: daysCount ?? 1 },
                              (_, j) => (field.state.value ?? [])[j] ?? "",
                            );
                            arr[i] = e.target.value;
                            field.handleChange(arr);
                          }}
                        />
                      </Field>
                    ))}
                  </FieldGroup>
                )}
              </form.Field>
            )}
          </form.Subscribe>
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
                form="itinerary-form"
                type="submit"
              >
                {isSubmitting ? <Spinner data-icon="inline-start" /> : null}
                {itinerary ? "Save changes" : "Create itinerary"}
              </Button>
            )}
          </form.Subscribe>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function getDefaultValues(itinerary: Itinerary | null): ItineraryFormValues {
  const days = itinerary?.days ?? 1;
  return {
    title: itinerary?.title ?? "",
    destination: itinerary?.destination ?? "",
    days,
    nights: itinerary?.nights ?? 0,
    overview: itinerary?.overview ?? null,
    price: itinerary?.price ?? null,
    dayDetails: Array.from(
      { length: days },
      (_, i) => (itinerary?.dayDetails ?? [])[i] ?? "",
    ),
  };
}
