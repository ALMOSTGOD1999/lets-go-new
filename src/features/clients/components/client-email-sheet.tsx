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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "#/components/ui/select";
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
import type { ClientEmailFormValues } from "#/features/clients/data/schema";
import { clientEmailFormSchema } from "#/features/clients/data/schema";

export type ClientEmailSheetDefaults = Partial<ClientEmailFormValues> & {
  audienceLabel?: string | null;
};

export function ClientEmailSheet({
  open,
  defaults,
  onOpenChange,
  onSubmit,
}: {
  open: boolean;
  defaults?: ClientEmailSheetDefaults;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: ClientEmailFormValues) => Promise<void>;
}) {
  const form = useForm({
    defaultValues: getDefaults(defaults),
    validators: {
      onChange: clientEmailFormSchema,
      onSubmit: clientEmailFormSchema,
    },
    onSubmit: async ({ value }) => {
      await onSubmit(value);
      form.reset(getDefaults(defaults));
    },
  });

  useEffect(() => {
    if (open) {
      form.reset(getDefaults(defaults));
    }
  }, [defaults, form, open]);

  const audienceLabel = defaults?.audienceLabel ?? null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>Send client email</SheetTitle>
          <SheetDescription>
            Send promotional or reminder emails through Resend using a branded
            template.
          </SheetDescription>
        </SheetHeader>
        <form
          id="client-email-form"
          className="flex flex-col gap-4 px-4"
          onSubmit={(event) => {
            event.preventDefault();
            event.stopPropagation();
            void form.handleSubmit();
          }}
        >
          <FieldGroup>
            <div className="grid gap-4 sm:grid-cols-2">
              <form.Field name="emailType">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;

                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Email type</FieldLabel>
                      <Select
                        value={field.state.value}
                        onValueChange={(value) =>
                          field.handleChange(value as ClientEmailFormValues["emailType"])
                        }
                      >
                        <SelectTrigger id={field.name} className="w-full">
                          <SelectValue placeholder="Select email type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="promotional">Promotional</SelectItem>
                            <SelectItem value="reminder">Reminder</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      {isInvalid ? (
                        <FieldError errors={field.state.meta.errors} />
                      ) : null}
                    </Field>
                  );
                }}
              </form.Field>
              <form.Field name="audience">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;

                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Audience</FieldLabel>
                      <Select
                        value={field.state.value}
                        onValueChange={(value) =>
                          field.handleChange(value as ClientEmailFormValues["audience"])
                        }
                      >
                        <SelectTrigger id={field.name} className="w-full">
                          <SelectValue placeholder="Select audience" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="all">All clients with email</SelectItem>
                            <SelectItem value="filtered">Filtered search results</SelectItem>
                            <SelectItem value="specific">Specific client</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                      {isInvalid ? (
                        <FieldError errors={field.state.meta.errors} />
                      ) : null}
                    </Field>
                  );
                }}
              </form.Field>
            </div>

            {audienceLabel ? (
              <Field>
                <FieldLabel>Current audience</FieldLabel>
                <div className="rounded-lg border border-border/60 bg-muted/40 px-3 py-2 text-sm text-muted-foreground">
                  {audienceLabel}
                </div>
              </Field>
            ) : null}

            <form.Field name="subject">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Subject</FieldLabel>
                    <Input
                      id={field.name}
                      value={field.state.value}
                      aria-invalid={isInvalid}
                      onBlur={field.handleBlur}
                      onChange={(event) => field.handleChange(event.target.value)}
                    />
                    {isInvalid ? (
                      <FieldError errors={field.state.meta.errors} />
                    ) : null}
                  </Field>
                );
              }}
            </form.Field>

            <form.Field name="headline">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Headline</FieldLabel>
                    <Input
                      id={field.name}
                      value={field.state.value}
                      aria-invalid={isInvalid}
                      onBlur={field.handleBlur}
                      onChange={(event) => field.handleChange(event.target.value)}
                    />
                    {isInvalid ? (
                      <FieldError errors={field.state.meta.errors} />
                    ) : null}
                  </Field>
                );
              }}
            </form.Field>

            <form.Field name="message">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Message</FieldLabel>
                    <Textarea
                      id={field.name}
                      value={field.state.value}
                      aria-invalid={isInvalid}
                      onBlur={field.handleBlur}
                      onChange={(event) => field.handleChange(event.target.value)}
                    />
                    {isInvalid ? (
                      <FieldError errors={field.state.meta.errors} />
                    ) : null}
                  </Field>
                );
              }}
            </form.Field>

            <div className="grid gap-4 sm:grid-cols-2">
              <form.Field name="ctaLabel">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;

                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>CTA label</FieldLabel>
                      <Input
                        id={field.name}
                        placeholder="Optional"
                        value={field.state.value ?? ""}
                        aria-invalid={isInvalid}
                        onBlur={field.handleBlur}
                        onChange={(event) =>
                          field.handleChange(event.target.value || null)
                        }
                      />
                      {isInvalid ? (
                        <FieldError errors={field.state.meta.errors} />
                      ) : null}
                    </Field>
                  );
                }}
              </form.Field>
              <form.Field name="ctaUrl">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;

                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>CTA URL</FieldLabel>
                      <Input
                        id={field.name}
                        placeholder="https://..."
                        value={field.state.value ?? ""}
                        aria-invalid={isInvalid}
                        onBlur={field.handleBlur}
                        onChange={(event) =>
                          field.handleChange(event.target.value || null)
                        }
                      />
                      {isInvalid ? (
                        <FieldError errors={field.state.meta.errors} />
                      ) : null}
                    </Field>
                  );
                }}
              </form.Field>
            </div>
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
                form="client-email-form"
                type="submit"
              >
                {isSubmitting ? <Spinner data-icon="inline-start" /> : null}
                Send email
              </Button>
            )}
          </form.Subscribe>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

function getDefaults(
  defaults?: ClientEmailSheetDefaults,
): ClientEmailFormValues {
  return {
    audience: defaults?.audience ?? "all",
    clientIds: defaults?.clientIds ?? [],
    search: defaults?.search ?? "",
    emailType: defaults?.emailType ?? "promotional",
    subject: defaults?.subject ?? "",
    headline: defaults?.headline ?? "",
    message: defaults?.message ?? "",
    ctaLabel: defaults?.ctaLabel ?? null,
    ctaUrl: defaults?.ctaUrl ?? null,
  };
}
