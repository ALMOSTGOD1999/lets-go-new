import { createFileRoute } from '@tanstack/react-router';

import { UnauthorizedError } from '#/features/errors/unauthorized-error';

export const Route = createFileRoute('/(errors)/401')({
  component: UnauthorizedError,
  head: () => ({
    meta: [{ title: '401 — LetsGo' }],
  }),
});
