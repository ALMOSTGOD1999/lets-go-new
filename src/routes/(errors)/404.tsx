import { createFileRoute } from '@tanstack/react-router';

import { NotFoundError } from '#/features/errors/not-found-error';

export const Route = createFileRoute('/(errors)/404')({
  component: NotFoundError,
  head: () => ({
    meta: [{ title: '404 — LetsGo' }],
  }),
});
