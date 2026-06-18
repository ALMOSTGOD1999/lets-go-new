import { createFileRoute, useRouteContext } from '@tanstack/react-router';

import { SettingsPage } from '#/features/settings';

export const Route = createFileRoute('/_authenticated/settings')({
  head: () => ({
    meta: [{ title: 'Settings — LetsGo' }],
  }),
  component: SettingsRoute,
});

function SettingsRoute() {
  const { user } = useRouteContext({ from: '/_authenticated' });
  return <SettingsPage user={user} />;
}
