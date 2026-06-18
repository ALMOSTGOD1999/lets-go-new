import { ErrorPage } from '#/features/errors/components/error-page';

export function MaintenanceError() {
  return (
    <ErrorPage
      code="503"
      title="Website is under maintenance."
      description={
        <>
          LetsGo is not available at the moment.
          <br /> We'll be back online shortly.
        </>
      }
      primaryActionLabel="Try dashboard"
    />
  );
}
