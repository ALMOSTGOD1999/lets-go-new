import { createFileRoute, redirect } from '@tanstack/react-router';

import { LoginPage } from '#/features/auth/page';
import { getSession } from '#/lib/auth-functions';

export const Route = createFileRoute('/(auth)/login')({
  head: () => ({
    meta: [{ title: 'Sign In — LetsGo' }],
  }),
  beforeLoad: async () => {
    const session = await getSession();

    if (session) {
      throw redirect({ to: '/' });
    }
  },
  component: LoginPage,
});
