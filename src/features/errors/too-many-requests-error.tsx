import { ErrorPage } from '#/features/errors/components/error-page';

export function TooManyRequestsError() {
  return (
    <ErrorPage
      code="429"
      title="Too many requests."
      description={
        <>
          You're moving a little too fast.
          <br /> Please wait a moment before trying again.
        </>
      }
    />
  );
}
