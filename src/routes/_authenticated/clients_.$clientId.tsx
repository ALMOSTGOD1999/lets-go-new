import { createFileRoute } from '@tanstack/react-router';

import { ClientDetailsPage } from '#/features/client-bookings';

export const Route = createFileRoute('/_authenticated/clients_/$clientId')({
  head: () => ({ meta: [{ title: 'Client details — LetsGo' }] }),
  component: ClientDetailsRoute,
});

function ClientDetailsRoute() {
  const { clientId } = Route.useParams();
  return <ClientDetailsPage clientId={Number(clientId)} />;
}
