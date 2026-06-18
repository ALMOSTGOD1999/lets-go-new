import { ErrorPage } from '#/features/errors/components/error-page';

export function ForbiddenError() {
  return (
    <ErrorPage
      code="403"
      title="Access forbidden."
      description={
        <>
          You don't have the necessary permission
          <br /> to view this resource.
        </>
      }
    />
  );
}
