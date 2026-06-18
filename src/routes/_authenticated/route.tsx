import { createFileRoute, redirect } from '@tanstack/react-router';

import { AuthenticatedLayout } from '#/components/layout/authenticated-layout';
import { getSession } from '#/lib/auth-functions';

export const Route = createFileRoute('/_authenticated')({
  beforeLoad: async () => {
    const session = await getSession();

    if (!session) {
      throw redirect({ to: '/login' });
    }

    return { user: session.user };
  },
  component: AuthenticatedLayout,
});
