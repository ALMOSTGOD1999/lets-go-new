import { createFileRoute } from '@tanstack/react-router';

import { TooManyRequestsError } from '#/features/errors/too-many-requests-error';

export const Route = createFileRoute('/(errors)/429')({
  component: TooManyRequestsError,
  head: () => ({
    meta: [{ title: '429 — LetsGo' }],
  }),
});
