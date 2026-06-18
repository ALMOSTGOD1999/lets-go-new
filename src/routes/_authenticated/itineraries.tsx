import { createFileRoute } from '@tanstack/react-router';

import { ItinerariesPage } from '#/features/itineraries';

export const Route = createFileRoute('/_authenticated/itineraries')({
  head: () => ({
    meta: [{ title: 'Itineraries — LetsGo' }],
  }),
  component: ItinerariesPage,
});
