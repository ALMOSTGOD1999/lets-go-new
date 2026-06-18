import { createFileRoute } from '@tanstack/react-router';

import { ReceiptsPage } from '#/features/bookings';

export const Route = createFileRoute(
  '/_authenticated/bookings_/$attendeeId/receipts',
)({
  component: RouteComponent,
});

function RouteComponent() {
  const { attendeeId } = Route.useParams();
  return <ReceiptsPage attendeeId={Number(attendeeId)} />;
}
