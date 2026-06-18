import { ErrorPage } from '#/features/errors/components/error-page';

export function BadRequestError() {
  return (
    <ErrorPage
      code="400"
      title="Bad request."
      description={
        <>
          The request could not be understood.
          <br /> Please check the URL and try again.
        </>
      }
    />
  );
}
