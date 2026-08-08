import { useForm } from "@tanstack/react-form";
import { CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "#/components/ui/button";
import { Calendar } from "#/components/ui/calendar";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "#/components/ui/field";
import { Input } from "#/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "#/components/ui/popover";
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
import type {
  Receipt,
  ReceiptFormValues,
  ReceiptMethod,
} from "#/features/bookings/data/schema";
import { receiptFormSchema } from "#/features/bookings/data/schema";
import { cn } from "#/lib/utils";

const paymentMethods: ReceiptMethod[] = [
  "Cash",
  "UPI",
  "Bank Transfer",
  "Card",
  "Other",
];

export function ReceiptSheet({
  open,
  receipt,
  attendeeId,
  onOpenChange,
  onSubmit,
}: {
  open: boolean;
  receipt: Receipt | null;
  attendeeId: number;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: ReceiptFormValues) => Promise<void>;
}) {
  const form = useForm({
    defaultValues: getDefaults(receipt, attendeeId),
    validators: { onChange: receiptFormSchema, onSubmit: receiptFormSchema },
    onSubmit: async ({ value }) => {
      await onSubmit(value);
      const defaults = getDefaults(null, attendeeId);
      form.reset(defaults);
      setAmountInput(String(defaults.amount));
    },
  });
  const [amountInput, setAmountInput] = useState(() =>
    String(getDefaults(receipt, attendeeId).amount),
  );

  useEffect(() => {
    if (open) {
      const defaults = getDefaults(receipt, attendeeId);
      form.reset(defaults);
      setAmountInput(String(defaults.amount));
    }
  }, [open, receipt, attendeeId, form]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>{receipt ? "Edit receipt" : "New receipt"}</SheetTitle>
          <SheetDescription>
            Record a payment for this booking.
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
            <div className="grid gap-4 sm:grid-cols-2">
              <form.Field name="date">
                {(field) => (
                  <ReceiptDatePicker
                    id={field.name}
                    label="Receipt date"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(value) => {
                      if (value) field.handleChange(value);
                    }}
                  />
                )}
              </form.Field>
              <form.Field name="amount">
                {(field) => {
                  const isInvalid =
                    field.state.meta.isTouched && !field.state.meta.isValid;

                  return (
                    <Field data-invalid={isInvalid}>
                      <FieldLabel htmlFor={field.name}>Amount</FieldLabel>
                      <Input
                        id={field.name}
                        inputMode="decimal"
                        placeholder="e.g. 1250.50"
                        type="text"
                        value={amountInput}
                        aria-invalid={isInvalid}
                        onBlur={() => {
                          const parsed = parseDecimalInput(amountInput);
                          const nextValue = Number.isFinite(parsed)
                            ? Math.max(1, parsed)
                            : 1;
                          field.handleChange(nextValue);
                          setAmountInput(formatDecimalInput(nextValue));
                          field.handleBlur();
                        }}
                        onChange={(event) => {
                          const nextInput = event.target.value;
                          setAmountInput(nextInput);
                          field.handleChange(
                            nextInput.trim() === ""
                              ? Number.NaN
                              : parseDecimalInput(nextInput),
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
            </div>
            <form.Field name="method">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Method</FieldLabel>
                  <Select
                    value={field.state.value}
                    onValueChange={(value) =>
                      field.handleChange(value as ReceiptMethod)
                    }
                  >
                    <SelectTrigger id={field.name} className="w-full">
                      <SelectValue placeholder="Select method" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {paymentMethods.map((method) => (
                          <SelectItem key={method} value={method}>
                            {method}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
              )}
            </form.Field>
            <form.Field name="methodInfo">
              {(field) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Method info</FieldLabel>
                  <Input
                    id={field.name}
                    placeholder="Transaction ID, UPI ID, bank, notes..."
                    value={field.state.value ?? ""}
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
              {receipt ? "Save changes" : "Create receipt"}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}

function ReceiptDatePicker({
  id,
  label,
  value,
  onBlur,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onBlur: () => void;
  onChange: (value: string | null) => void;
}) {
  const [open, setOpen] = useState(false);
  const selectedDate = parseDateInputValue(value);

  return (
    <Field>
      <FieldLabel htmlFor={id}>{label}</FieldLabel>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          render={
            <Button
              id={id}
              aria-label={label}
              className={cn(
                "w-full justify-start text-left font-normal",
                !selectedDate && "text-muted-foreground",
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
              onChange(date ? toDateInputValue(date) : null);
              onBlur();
              setOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
    </Field>
  );
}

function getDefaults(
  receipt: Receipt | null,
  attendeeId: number,
): ReceiptFormValues {
  const today = new Date().toISOString().slice(0, 10);
  return receipt
    ? {
        id: receipt.id,
        attendeeId: receipt.attendeeId,
        date: toDateString(receipt.date),
        amount: receipt.amount,
        method: receipt.method,
        methodInfo: receipt.methodInfo,
      }
    : {
        attendeeId,
        date: today,
        amount: 1,
        method: "Cash",
        methodInfo: null,
      };
}

function toDateInputValue(date: Date) {
  return date.toISOString().slice(0, 10);
}

function toDateString(value: Date | string) {
  const date = value instanceof Date ? value : new Date(value);
  return toDateInputValue(date);
}

function parseDecimalInput(value: string) {
  const normalized = value.replace(/,/g, ".").replace(/\s+/g, "").trim();
  if (!normalized) {
    return Number.NaN;
  }

  return Number.parseFloat(normalized);
}

function formatDecimalInput(value: number) {
  return Number.isInteger(value) ? String(value) : String(roundMoney(value));
}

function roundMoney(value: number) {
  return Math.round(value * 100) / 100;
}

function parseDateInputValue(value: string | null | undefined) {
  return value ? new Date(value) : undefined;
}

function formatDisplayDate(date: Date) {
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(date);
}
