import { createFileRoute } from '@tanstack/react-router';

import { BadRequestError } from '#/features/errors/bad-request-error';

export const Route = createFileRoute('/(errors)/400')({
  component: BadRequestError,
  head: () => ({
    meta: [{ title: '400 — LetsGo' }],
  }),
});
