import { createFileRoute, useRouteContext } from '@tanstack/react-router';

import { Dashboard } from '#/features/dashboard';

export const Route = createFileRoute('/_authenticated/')({
  head: () => ({
    meta: [{ title: 'Dashboard — LetsGo' }],
  }),
  component: DashboardRoute,
});

function DashboardRoute() {
  const { user } = useRouteContext({ from: '/_authenticated' });

  return <Dashboard user={user} />;
}
