import { createFileRoute } from '@tanstack/react-router';

import { BadRequestError } from '#/features/errors/bad-request-error';
import { ForbiddenError } from '#/features/errors/forbidden-error';
import { GeneralError } from '#/features/errors/general-error';
import { MaintenanceError } from '#/features/errors/maintenance-error';
import { NotFoundError } from '#/features/errors/not-found-error';
import { TooManyRequestsError } from '#/features/errors/too-many-requests-error';
import { UnauthorizedError } from '#/features/errors/unauthorized-error';

const errorMap = {
  'bad-request': BadRequestError,
  unauthorized: UnauthorizedError,
  forbidden: ForbiddenError,
  'not-found': NotFoundError,
  'too-many-requests': TooManyRequestsError,
  'internal-server-error': GeneralError,
  maintenance: MaintenanceError,
};

export const Route = createFileRoute('/_authenticated/errors/$error')({
  component: ErrorRoute,
  head: ({ params }) => ({
    meta: [{ title: `${params.error} — LetsGo` }],
  }),
});

function ErrorRoute() {
  const { error } = Route.useParams();
  const ErrorComponent =
    errorMap[error as keyof typeof errorMap] ?? NotFoundError;

  return <ErrorComponent />;
}
