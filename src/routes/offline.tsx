import { createFileRoute } from '@tanstack/react-router';

import { OfflinePage } from '#/features/offline';

export const Route = createFileRoute('/offline')({
  component: OfflinePage,
  head: () => ({
    meta: [{ title: 'Offline — LetsGo' }],
  }),
});
