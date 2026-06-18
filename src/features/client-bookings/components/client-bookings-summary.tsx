export function ClientBookingsSummary({
  bookingCount,
  adults,
  childCount,
  totalBilled,
  totalReceived,
  balance,
}: {
  bookingCount: number;
  adults: number;
  childCount: number;
  totalBilled: number;
  totalReceived: number;
  balance: number;
}) {
  return (
    <div className="flex flex-wrap gap-x-8 gap-y-3 pt-1">
      <SummaryText label="Tour bookings" value={`${bookingCount}`} />
      <SummaryText label="Travelers" value={`${adults} + ${childCount}`} />
      <SummaryText label="Billed" value={formatCurrency(totalBilled)} />
      <SummaryText label="Received" value={formatCurrency(totalReceived)} />
      <SummaryText label="Balance" value={formatCurrency(balance)} />
    </div>
  );
}

function SummaryText({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs uppercase tracking-wide text-muted-foreground">
        {label}
      </span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
}
