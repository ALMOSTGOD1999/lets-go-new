import { ErrorPage } from '#/features/errors/components/error-page';

type GeneralErrorProps = React.ComponentProps<'div'> & {
  minimal?: boolean;
};

export function GeneralError({
  className,
  minimal = false,
}: GeneralErrorProps) {
  return (
    <ErrorPage
      className={className}
      code="500"
      title="Oops! Something went wrong."
      description={
        <>
          We apologize for the inconvenience.
          <br /> Please try again later.
        </>
      }
      showActions={!minimal}
    />
  );
}
