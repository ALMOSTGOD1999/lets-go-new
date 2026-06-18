import { ErrorPage } from '#/features/errors/components/error-page';

export function NotFoundError() {
  return (
    <ErrorPage
      code="404"
      title="Oops! Page not found."
      description={
        <>
          The page you're looking for does not exist
          <br /> or might have been removed.
        </>
      }
    />
  );
}
