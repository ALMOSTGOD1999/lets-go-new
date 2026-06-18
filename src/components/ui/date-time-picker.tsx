import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

import { Button } from '#/components/ui/button';
import { Calendar } from '#/components/ui/calendar';
import { FieldLabel } from '#/components/ui/field';
import { InputGroup, InputGroupInput } from '#/components/ui/input-group';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '#/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '#/components/ui/select';
import { Separator } from '#/components/ui/separator';

type Period = 'AM' | 'PM';

interface TimeSelection {
  displayHour: number;
  minute: number;
  period: Period;
}

function parseValue(value: string): {
  year: number;
  month: number;
  day: number;
  hours: number;
  minutes: number;
} | null {
  if (!value) return null;
  const [datePart, timePart] = value.split('T');
  if (!datePart || !timePart) return null;
  const dateParts = datePart.split('-').map(Number);
  const timeParts = timePart.split(':').map(Number);
  if (dateParts.length !== 3 || timeParts.length < 2) return null;
  const [year, month, day] = dateParts;
  const [hours, minutes] = timeParts;
  if (
    Number.isNaN(year) ||
    Number.isNaN(month) ||
    Number.isNaN(day) ||
    Number.isNaN(hours) ||
    Number.isNaN(minutes)
  ) {
    return null;
  }
  return { year, month, day, hours, minutes };
}

function toValue(
  year: number,
  month: number,
  day: number,
  hours: number,
  minutes: number,
): string {
  return [
    `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`,
    `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`,
  ].join('T');
}

function toTimeSelection(hours24: number, minutes: number): TimeSelection {
  return {
    displayHour: hours24 === 0 ? 12 : hours24 > 12 ? hours24 - 12 : hours24,
    minute: minutes,
    period: hours24 < 12 ? 'AM' : 'PM',
  };
}

function toHours24(displayHour: number, period: Period): number {
  if (period === 'AM') return displayHour === 12 ? 0 : displayHour;
  return displayHour === 12 ? 12 : displayHour + 12;
}

export function DateTimePicker({
  value,
  onChange,
  label,
  disabled,
}: {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  id?: string;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const parsed = parseValue(value);

  const selectedDate = parsed
    ? new Date(parsed.year, parsed.month - 1, parsed.day)
    : undefined;

  const initial = parsed
    ? toTimeSelection(parsed.hours, parsed.minutes)
    : { displayHour: 12, minute: 0, period: 'AM' as Period };
  const [time, setTime] = useState<TimeSelection>(initial);

  // biome-ignore lint/correctness/useExhaustiveDependencies: parsed is derived from value each render
  useEffect(() => {
    if (parsed) setTime(toTimeSelection(parsed.hours, parsed.minutes));
  }, [value]);

  const updateDateTime = (
    date: { year: number; month: number; day: number } | null,
    t: TimeSelection,
  ) => {
    const d = date ?? parsed;
    if (!d) return;
    onChange(
      toValue(
        d.year,
        d.month,
        d.day,
        toHours24(t.displayHour, t.period),
        t.minute,
      ),
    );
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (!date) return;
    updateDateTime(
      {
        year: date.getFullYear(),
        month: date.getMonth() + 1,
        day: date.getDate(),
      },
      time,
    );
    setOpen(false);
  };

  const handleTimeChange = (t: TimeSelection) => {
    setTime(t);
    updateDateTime(null, t);
  };

  const formattedValue = parsed
    ? `${format(new Date(parsed.year, parsed.month - 1, parsed.day), 'MMM d, yyyy')} ${String(time.displayHour).padStart(2, '0')}:${String(time.minute).padStart(2, '0')} ${time.period}`
    : '';

  return (
    <div className="flex flex-col gap-1.5">
      {label ? <FieldLabel>{label}</FieldLabel> : null}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          render={
            <Button
              variant="outline"
              disabled={disabled}
              data-empty={!value}
              className="w-full justify-start font-normal data-[empty=true]:text-muted-foreground"
            />
          }
        >
          <CalendarIcon />
          {value ? formattedValue : 'Pick date & time'}
        </PopoverTrigger>
        <PopoverContent className="flex w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={selectedDate}
            captionLayout="dropdown"
            defaultMonth={selectedDate}
            onSelect={handleDateSelect}
          />
          <Separator orientation="vertical" />
          <TimePicker value={time} onChange={handleTimeChange} />
        </PopoverContent>
      </Popover>
    </div>
  );
}

function TimePicker({
  value,
  onChange,
}: {
  value: TimeSelection;
  onChange: (value: TimeSelection) => void;
}) {
  const [hourInput, setHourInput] = useState(String(value.displayHour));
  const [minuteInput, setMinuteInput] = useState(String(value.minute));

  useEffect(() => {
    setHourInput(String(value.displayHour));
    setMinuteInput(String(value.minute));
  }, [value.displayHour, value.minute]);

  return (
    <div className="flex items-center gap-1 p-3">
      <InputGroup>
        <InputGroupInput
          type="number"
          inputMode="numeric"
          pattern="[0-9]*"
          min={1}
          max={12}
          value={hourInput}
          onFocus={(event) => event.target.select()}
          onChange={(event) => {
            const nextValue = event.target.value;
            setHourInput(nextValue);
            if (nextValue === '') return;

            const h = Number(nextValue);
            if (h >= 1 && h <= 12) {
              onChange({ ...value, displayHour: Math.round(h) });
            }
          }}
          onBlur={(event) => {
            const h = Number(event.target.value);
            if (h < 1 || h > 12 || Number.isNaN(h)) {
              setHourInput(String(value.displayHour));
            }
          }}
          className="w-14"
          aria-label="Hour"
        />
      </InputGroup>
      <span className="text-muted-foreground text-sm">:</span>
      <InputGroup>
        <InputGroupInput
          type="number"
          inputMode="numeric"
          pattern="[0-9]*"
          min={0}
          max={59}
          value={minuteInput}
          onFocus={(event) => event.target.select()}
          onChange={(event) => {
            const nextValue = event.target.value;
            setMinuteInput(nextValue);
            if (nextValue === '') return;

            const m = Number(nextValue);
            if (m >= 0 && m <= 59) {
              onChange({ ...value, minute: Math.round(m) });
            }
          }}
          onBlur={(event) => {
            const m = Number(event.target.value);
            if (m < 0 || m > 59 || Number.isNaN(m)) {
              setMinuteInput(String(value.minute));
            }
          }}
          className="w-14"
          aria-label="Minute"
        />
      </InputGroup>
      <Select
        value={value.period}
        onValueChange={(v) => onChange({ ...value, period: v as Period })}
      >
        <SelectTrigger className="w-16">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectItem value="AM">AM</SelectItem>
            <SelectItem value="PM">PM</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </div>
  );
}
