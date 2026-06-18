import { ErrorPage } from '#/features/errors/components/error-page';

export function UnauthorizedError() {
  return (
    <ErrorPage
      code="401"
      title="Unauthorized access."
      description={
        <>
          Please sign in with the right credentials
          <br /> to access this resource.
        </>
      }
      primaryActionLabel="Go to login"
      primaryActionTo="/login"
    />
  );
}
