import { type LinkProps, useNavigate, useRouter } from '@tanstack/react-router';

import { Button } from '#/components/ui/button';
import { cn } from '#/lib/utils';

type ErrorPageProps = {
  code: string;
  title: string;
  description: React.ReactNode;
  className?: string;
  showActions?: boolean;
  primaryActionLabel?: string;
  primaryActionTo?: LinkProps['to'];
  secondaryActionLabel?: string;
};

export function ErrorPage({
  code,
  title,
  description,
  className,
  showActions = true,
  primaryActionLabel = 'Back to dashboard',
  primaryActionTo = '/',
  secondaryActionLabel = 'Go back',
}: ErrorPageProps) {
  const navigate = useNavigate();
  const { history } = useRouter();

  return (
    <div className={cn('h-svh w-full', className)}>
      <div className="m-auto flex h-full w-full flex-col items-center justify-center gap-2 px-4 text-center">
        <h1 className="font-bold text-[7rem] leading-tight">{code}</h1>
        <span className="font-medium">{title}</span>
        <p className="text-muted-foreground">{description}</p>
        {showActions ? (
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <Button variant="outline" onClick={() => history.go(-1)}>
              {secondaryActionLabel}
            </Button>
            <Button onClick={() => navigate({ to: primaryActionTo })}>
              {primaryActionLabel}
            </Button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
