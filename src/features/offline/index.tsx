import { WifiOffIcon } from 'lucide-react';

import { Button } from '#/components/ui/button';

export function OfflinePage() {
  return (
    <div className="flex min-h-svh w-full items-center justify-center px-4 text-center">
      <div className="flex max-w-md flex-col items-center gap-4">
        <div className="flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
          <WifiOffIcon />
        </div>
        <div className="flex flex-col gap-2">
          <h1 className="font-bold text-3xl">You&apos;re offline</h1>
          <p className="text-muted-foreground">
            No internet connection. Some features may be unavailable.
          </p>
        </div>
        <Button
          onClick={() => {
            window.location.reload();
          }}
          type="button"
        >
          Try again
        </Button>
      </div>
    </div>
  );
}
