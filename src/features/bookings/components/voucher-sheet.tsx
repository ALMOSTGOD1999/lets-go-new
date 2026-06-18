import { useForm } from "@tanstack/react-form";
import { CalendarIcon } from "lucide-react";
import { useEffect, useState } from "react";

import { Button } from "#/components/ui/button";
import { Calendar } from "#/components/ui/calendar";
import { Field, FieldGroup, FieldLabel } from "#/components/ui/field";
import { Input } from "#/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "#/components/ui/popover";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "#/components/ui/sheet";
import { Textarea } from "#/components/ui/textarea";
import type {
  Voucher,
  VoucherFormValues,
  VoucherType,
} from "#/features/bookings/data/schema";
import { voucherFormSchema } from "#/features/bookings/data/schema";
import { cn } from "#/lib/utils";

const TYPE_LABELS: Record<VoucherType, string> = {
  hotel: "Hotel Voucher",
  package: "Package Voucher",
  vehicle: "Vehicle Voucher",
};

export function VoucherSheet({
  open,
  voucher,
  attendeeId,
  initialType = "hotel",
  onOpenChange,
  onSubmit,
}: {
  open: boolean;
  voucher: Voucher | null;
  attendeeId: number;
  initialType?: VoucherType;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: VoucherFormValues) => Promise<void>;
}) {
  const effectiveType: VoucherType = voucher
    ? ((voucher.voucherType as VoucherType) ?? "hotel")
    : initialType;

  const form = useForm({
    defaultValues: getDefaults(voucher, attendeeId, effectiveType),
    validators: { onChange: voucherFormSchema, onSubmit: voucherFormSchema },
    onSubmit: async ({ value }) => {
      await onSubmit(value);
      form.reset(getDefaults(null, attendeeId, effectiveType));
    },
  });

  useEffect(() => {
    if (open) form.reset(getDefaults(voucher, attendeeId, effectiveType));
  }, [open, voucher, attendeeId, effectiveType, form]);

  const label = TYPE_LABELS[effectiveType];

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="overflow-y-auto sm:max-w-xl">
        <SheetHeader>
          <SheetTitle>{voucher ? `Edit — ${label}` : label}</SheetTitle>
          <SheetDescription>
            {effectiveType === "hotel" &&
              "Document a hotel or accommodation service voucher."}
            {effectiveType === "package" &&
              "Document a travel package or tour voucher."}
            {effectiveType === "vehicle" &&
              "Document a vehicle or transport voucher."}
          </SheetDescription>
        </SheetHeader>

        <form
          id="voucher-form"
          className="flex flex-col gap-4 px-4"
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            void form.handleSubmit();
          }}
        >
          {/* ── Common header fields ────────────────────────────────────────── */}
          <FieldGroup>
            <div className="grid gap-4 sm:grid-cols-2">
              <form.Field name="date">
                {(f) => (
                  <VoucherDatePicker
                    id={f.name}
                    label="Issue date"
                    value={f.state.value}
                    onBlur={f.handleBlur}
                    onChange={(v) => {
                      if (v) f.handleChange(v);
                    }}
                  />
                )}
              </form.Field>
              <form.Field name="bookingId">
                {(f) => (
                  <FieldWrap label="Booking ID">
                    <Input
                      id={f.name}
                      value={f.state.value ?? ""}
                      onBlur={f.handleBlur}
                      onChange={(e) => f.handleChange(e.target.value || null)}
                    />
                  </FieldWrap>
                )}
              </form.Field>
            </div>
          </FieldGroup>

          {/* ── Hotel Voucher fields ─────────────────────────────────────────── */}
          {effectiveType === "hotel" && (
            <FieldGroup>
              <div className="grid gap-4 sm:grid-cols-2">
                <form.Field name="serviceType">
                  {(f) => (
                    <FieldWrap label="Service type">
                      <Input
                        id={f.name}
                        value={f.state.value}
                        onBlur={f.handleBlur}
                        onChange={(e) => f.handleChange(e.target.value)}
                      />
                    </FieldWrap>
                  )}
                </form.Field>
                <form.Field name="propertyName">
                  {(f) => (
                    <FieldWrap label="Property / name">
                      <Input
                        id={f.name}
                        value={f.state.value}
                        onBlur={f.handleBlur}
                        onChange={(e) => f.handleChange(e.target.value)}
                      />
                    </FieldWrap>
                  )}
                </form.Field>
              </div>
              <form.Field name="address">
                {(f) => (
                  <FieldWrap label="Address">
                    <Input
                      id={f.name}
                      value={f.state.value ?? ""}
                      onBlur={f.handleBlur}
                      onChange={(e) => f.handleChange(e.target.value || null)}
                    />
                  </FieldWrap>
                )}
              </form.Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <form.Field name="checkinDate">
                  {(f) => (
                    <VoucherDatePicker
                      id={f.name}
                      label="Check-in"
                      value={f.state.value}
                      onBlur={f.handleBlur}
                      onChange={f.handleChange}
                    />
                  )}
                </form.Field>
                <form.Field name="checkoutDate">
                  {(f) => (
                    <VoucherDatePicker
                      id={f.name}
                      label="Check-out"
                      value={f.state.value}
                      onBlur={f.handleBlur}
                      onChange={f.handleChange}
                    />
                  )}
                </form.Field>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <form.Field name="subBookingType">
                  {(f) => (
                    <FieldWrap label="Sub booking type">
                      <Input
                        id={f.name}
                        value={f.state.value ?? ""}
                        onBlur={f.handleBlur}
                        onChange={(e) => f.handleChange(e.target.value || null)}
                      />
                    </FieldWrap>
                  )}
                </form.Field>
                <form.Field name="meal">
                  {(f) => (
                    <FieldWrap label="Meal">
                      <Input
                        id={f.name}
                        value={f.state.value ?? ""}
                        onBlur={f.handleBlur}
                        onChange={(e) => f.handleChange(e.target.value || null)}
                      />
                    </FieldWrap>
                  )}
                </form.Field>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <form.Field name="payment">
                  {(f) => (
                    <FieldWrap label="Payment">
                      <Input
                        id={f.name}
                        value={f.state.value ?? ""}
                        onBlur={f.handleBlur}
                        onChange={(e) => f.handleChange(e.target.value || null)}
                      />
                    </FieldWrap>
                  )}
                </form.Field>
                <form.Field name="confirmedBy">
                  {(f) => (
                    <FieldWrap label="Confirmed by">
                      <Input
                        id={f.name}
                        value={f.state.value ?? ""}
                        onBlur={f.handleBlur}
                        onChange={(e) => f.handleChange(e.target.value || null)}
                      />
                    </FieldWrap>
                  )}
                </form.Field>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <form.Field name="serviceContact">
                  {(f) => (
                    <FieldWrap label="Service contact">
                      <Input
                        id={f.name}
                        value={f.state.value ?? ""}
                        onBlur={f.handleBlur}
                        onChange={(e) => f.handleChange(e.target.value || null)}
                      />
                    </FieldWrap>
                  )}
                </form.Field>
                <form.Field name="confirmerContact">
                  {(f) => (
                    <FieldWrap label="Confirmer contact">
                      <Input
                        id={f.name}
                        value={f.state.value ?? ""}
                        onBlur={f.handleBlur}
                        onChange={(e) => f.handleChange(e.target.value || null)}
                      />
                    </FieldWrap>
                  )}
                </form.Field>
              </div>
            </FieldGroup>
          )}

          {/* ── Package Voucher fields ───────────────────────────────────────── */}
          {effectiveType === "package" && (
            <FieldGroup>
              <form.Field name="propertyName">
                {(f) => (
                  <FieldWrap label="Package name">
                    <Input
                      id={f.name}
                      value={f.state.value}
                      onBlur={f.handleBlur}
                      onChange={(e) => f.handleChange(e.target.value)}
                    />
                  </FieldWrap>
                )}
              </form.Field>
              <form.Field name="address">
                {(f) => (
                  <FieldWrap label="Destinations / Route">
                    <Input
                      id={f.name}
                      value={f.state.value ?? ""}
                      onBlur={f.handleBlur}
                      onChange={(e) => f.handleChange(e.target.value || null)}
                    />
                  </FieldWrap>
                )}
              </form.Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <form.Field name="checkinDate">
                  {(f) => (
                    <VoucherDatePicker
                      id={f.name}
                      label="Travel from"
                      value={f.state.value}
                      onBlur={f.handleBlur}
                      onChange={f.handleChange}
                    />
                  )}
                </form.Field>
                <form.Field name="checkoutDate">
                  {(f) => (
                    <VoucherDatePicker
                      id={f.name}
                      label="Travel to"
                      value={f.state.value}
                      onBlur={f.handleBlur}
                      onChange={f.handleChange}
                    />
                  )}
                </form.Field>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <form.Field name="subBookingType">
                  {(f) => (
                    <FieldWrap label="No. of pax">
                      <Input
                        id={f.name}
                        value={f.state.value ?? ""}
                        onBlur={f.handleBlur}
                        onChange={(e) => f.handleChange(e.target.value || null)}
                      />
                    </FieldWrap>
                  )}
                </form.Field>
                <form.Field name="meal">
                  {(f) => (
                    <FieldWrap label="Meal plan">
                      <Input
                        id={f.name}
                        value={f.state.value ?? ""}
                        onBlur={f.handleBlur}
                        onChange={(e) => f.handleChange(e.target.value || null)}
                      />
                    </FieldWrap>
                  )}
                </form.Field>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <form.Field name="payment">
                  {(f) => (
                    <FieldWrap label="Payment mode">
                      <Input
                        id={f.name}
                        value={f.state.value ?? ""}
                        onBlur={f.handleBlur}
                        onChange={(e) => f.handleChange(e.target.value || null)}
                      />
                    </FieldWrap>
                  )}
                </form.Field>
                <form.Field name="confirmedBy">
                  {(f) => (
                    <FieldWrap label="Confirmed by">
                      <Input
                        id={f.name}
                        value={f.state.value ?? ""}
                        onBlur={f.handleBlur}
                        onChange={(e) => f.handleChange(e.target.value || null)}
                      />
                    </FieldWrap>
                  )}
                </form.Field>
              </div>
              <form.Field name="serviceContact">
                {(f) => (
                  <FieldWrap label="Contact">
                    <Input
                      id={f.name}
                      value={f.state.value ?? ""}
                      onBlur={f.handleBlur}
                      onChange={(e) => f.handleChange(e.target.value || null)}
                    />
                  </FieldWrap>
                )}
              </form.Field>
            </FieldGroup>
          )}

          {/* ── Vehicle Voucher fields ───────────────────────────────────────── */}
          {effectiveType === "vehicle" && (
            <FieldGroup>
              <div className="grid gap-4 sm:grid-cols-2">
                <form.Field name="serviceType">
                  {(f) => (
                    <FieldWrap label="Vehicle type">
                      <Input
                        id={f.name}
                        placeholder="e.g. Sedan, SUV, Bus"
                        value={f.state.value}
                        onBlur={f.handleBlur}
                        onChange={(e) => f.handleChange(e.target.value)}
                      />
                    </FieldWrap>
                  )}
                </form.Field>
                <form.Field name="propertyName">
                  {(f) => (
                    <FieldWrap label="Agency / cab name">
                      <Input
                        id={f.name}
                        value={f.state.value}
                        onBlur={f.handleBlur}
                        onChange={(e) => f.handleChange(e.target.value)}
                      />
                    </FieldWrap>
                  )}
                </form.Field>
              </div>
              <form.Field name="address">
                {(f) => (
                  <FieldWrap label="Pickup location">
                    <Input
                      id={f.name}
                      value={f.state.value ?? ""}
                      onBlur={f.handleBlur}
                      onChange={(e) => f.handleChange(e.target.value || null)}
                    />
                  </FieldWrap>
                )}
              </form.Field>
              <form.Field name="subBookingType">
                {(f) => (
                  <FieldWrap label="Drop location / Route">
                    <Input
                      id={f.name}
                      value={f.state.value ?? ""}
                      onBlur={f.handleBlur}
                      onChange={(e) => f.handleChange(e.target.value || null)}
                    />
                  </FieldWrap>
                )}
              </form.Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <form.Field name="checkinDate">
                  {(f) => (
                    <VoucherDatePicker
                      id={f.name}
                      label="Pickup date"
                      value={f.state.value}
                      onBlur={f.handleBlur}
                      onChange={f.handleChange}
                    />
                  )}
                </form.Field>
                <form.Field name="checkoutDate">
                  {(f) => (
                    <VoucherDatePicker
                      id={f.name}
                      label="Drop date"
                      value={f.state.value}
                      onBlur={f.handleBlur}
                      onChange={f.handleChange}
                    />
                  )}
                </form.Field>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <form.Field name="payment">
                  {(f) => (
                    <FieldWrap label="Payment mode">
                      <Input
                        id={f.name}
                        value={f.state.value ?? ""}
                        onBlur={f.handleBlur}
                        onChange={(e) => f.handleChange(e.target.value || null)}
                      />
                    </FieldWrap>
                  )}
                </form.Field>
                <form.Field name="confirmedBy">
                  {(f) => (
                    <FieldWrap label="Driver name">
                      <Input
                        id={f.name}
                        value={f.state.value ?? ""}
                        onBlur={f.handleBlur}
                        onChange={(e) => f.handleChange(e.target.value || null)}
                      />
                    </FieldWrap>
                  )}
                </form.Field>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <form.Field name="serviceContact">
                  {(f) => (
                    <FieldWrap label="Driver contact">
                      <Input
                        id={f.name}
                        value={f.state.value ?? ""}
                        onBlur={f.handleBlur}
                        onChange={(e) => f.handleChange(e.target.value || null)}
                      />
                    </FieldWrap>
                  )}
                </form.Field>
                <form.Field name="confirmerContact">
                  {(f) => (
                    <FieldWrap label="Agency contact">
                      <Input
                        id={f.name}
                        value={f.state.value ?? ""}
                        onBlur={f.handleBlur}
                        onChange={(e) => f.handleChange(e.target.value || null)}
                      />
                    </FieldWrap>
                  )}
                </form.Field>
              </div>
            </FieldGroup>
          )}

          {/* ── Remarks (common to all types) ────────────────────────────────── */}
          <div className="rounded-lg border border-dashed border-muted-foreground/30 p-4">
            <form.Field name="remarks">
              {(f) => (
                <Field>
                  <FieldLabel
                    htmlFor={f.name}
                    className="text-muted-foreground text-xs uppercase tracking-wider"
                  >
                    Remarks
                  </FieldLabel>
                  <Textarea
                    id={f.name}
                    placeholder="Any additional notes, special instructions, or remarks..."
                    value={f.state.value ?? ""}
                    rows={3}
                    onBlur={f.handleBlur}
                    onChange={(e) => f.handleChange(e.target.value || null)}
                  />
                </Field>
              )}
            </form.Field>
          </div>

          <SheetFooter className="px-0 pb-4">
            <Button form="voucher-form" type="submit">
              {voucher ? "Save changes" : `Create ${label}`}
            </Button>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  );
}

function FieldWrap({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <Field>
      <FieldLabel>{label}</FieldLabel>
      {children}
    </Field>
  );
}

function VoucherDatePicker({
  id,
  label,
  value,
  onBlur,
  onChange,
}: {
  id: string;
  label: string;
  value: string | null | undefined;
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
  voucher: Voucher | null,
  attendeeId: number,
  type: VoucherType,
): VoucherFormValues {
  const today = new Date().toISOString().slice(0, 10);
  if (voucher) {
    return {
      id: voucher.id,
      attendeeId: voucher.attendeeId,
      voucherType: (voucher.voucherType as VoucherType) ?? "hotel",
      bookingId: voucher.bookingId,
      date: voucher.date.toISOString().slice(0, 10),
      serviceType: voucher.serviceType,
      propertyName: voucher.propertyName,
      address: voucher.address,
      checkinDate: voucher.checkinDate?.toISOString().slice(0, 10) ?? null,
      checkoutDate: voucher.checkoutDate?.toISOString().slice(0, 10) ?? null,
      subBookingType: voucher.subBookingType,
      meal: voucher.meal,
      payment: voucher.payment,
      confirmedBy: voucher.confirmedBy,
      serviceContact: voucher.serviceContact,
      confirmerContact: voucher.confirmerContact,
      remarks: voucher.remarks,
    };
  }
  return {
    attendeeId,
    voucherType: type,
    bookingId: `VCH-${today.replaceAll("-", "")}-001`,
    date: today,
    serviceType: type === "package" ? "Package" : "",
    propertyName: "",
    address: null,
    checkinDate: null,
    checkoutDate: null,
    subBookingType: null,
    meal: null,
    payment: null,
    confirmedBy: null,
    serviceContact: null,
    confirmerContact: null,
    remarks: null,
  };
}

function toDateInputValue(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function parseDateInputValue(value: string | null | undefined) {
  if (!value) return undefined;
  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return undefined;
  return new Date(year, month - 1, day);
}

function formatDisplayDate(date: Date) {
  return new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(date);
}
