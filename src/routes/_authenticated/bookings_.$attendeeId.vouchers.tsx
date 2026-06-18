import { createFileRoute } from '@tanstack/react-router';

import { VouchersPage } from '#/features/bookings';

export const Route = createFileRoute(
  '/_authenticated/bookings_/$attendeeId/vouchers',
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { attendeeId } = Route.useParams();
  return <VouchersPage attendeeId={Number(attendeeId)} />;
}
