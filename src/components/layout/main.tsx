import { cn } from '#/lib/utils';

type MainProps = React.ComponentProps<'div'> & {
  fluid?: boolean;
};

export function Main({ className, fluid, ...props }: MainProps) {
  return (
    <div
      className={cn(
        'px-4 py-6',
        !fluid && 'mx-auto w-full max-w-7xl',
        className,
      )}
      {...props}
    />
  );
}
