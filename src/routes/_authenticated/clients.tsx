import { createFileRoute } from '@tanstack/react-router';

import { ClientsPage } from '#/features/clients';

export const Route = createFileRoute('/_authenticated/clients')({
  head: () => ({
    meta: [{ title: 'Clients — LetsGo' }],
  }),
  component: ClientsPage,
});
