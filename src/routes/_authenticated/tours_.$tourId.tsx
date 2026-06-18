import { createFileRoute } from '@tanstack/react-router';

import { TourDetailsPage } from '#/features/tour-attendees';

export const Route = createFileRoute('/_authenticated/tours_/$tourId')({
  head: () => ({ meta: [{ title: 'Tour details — LetsGo' }] }),
  component: TourDetailsRoute,
});

function TourDetailsRoute() {
  const { tourId } = Route.useParams();
  return <TourDetailsPage tourId={Number(tourId)} />;
}
