import { Link } from '@tanstack/react-router';
import { ChevronLeftIcon } from 'lucide-react';
import type { ReactNode } from 'react';

import { Button } from '#/components/ui/button';
import { Card, CardAction, CardHeader } from '#/components/ui/card';

export function ClientDetailsHeader({
  name,
  phone,
  email,
  address,
  onEditClient,
  onAssignTour,
  canEdit = true,
  children,
}: {
  name?: string;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  onEditClient: () => void;
  onAssignTour: () => void;
  canEdit?: boolean;
  children: ReactNode;
}) {
  return (
    <Card className="overflow-hidden border-border/60 bg-card/80 shadow-sm backdrop-blur-sm">
      <CardHeader className="gap-6 p-4 sm:px-6">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex min-w-0 flex-col gap-4">
              <Button
                nativeButton={false}
                render={<Link to="/clients" />}
                type="button"
                variant="link"
                className="h-auto w-fit gap-1 p-0 text-muted-foreground"
              >
                <ChevronLeftIcon data-icon="inline-start" />
                Back to clients
              </Button>
              <div className="flex max-w-3xl flex-col gap-3">
                <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
                  Client details
                </p>
                <h1 className="font-heading text-3xl leading-none font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                  {name ?? 'Client details'}
                </h1>
                <div className="flex flex-col gap-1 text-balance text-muted-foreground sm:flex-row sm:flex-wrap sm:gap-x-4">
                  {phone ? (
                    <a
                      className="hover:text-foreground hover:underline"
                      href={`tel:${phone}`}
                    >
                      {phone}
                    </a>
                  ) : (
                    <span>No phone</span>
                  )}
                  {email ? (
                    <a
                      className="hover:text-foreground hover:underline"
                      href={`mailto:${email}`}
                    >
                      {email}
                    </a>
                  ) : (
                    <span>No email</span>
                  )}
                  <span>{address ?? 'No address'}</span>
                </div>
              </div>
            </div>
            <CardAction className="self-start">
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button
                  disabled={!canEdit}
                  onClick={onEditClient}
                  type="button"
                  variant="outline"
                  className="w-full sm:w-auto"
                >
                  Edit client
                </Button>
                <Button
                  onClick={onAssignTour}
                  type="button"
                  className="w-full sm:w-auto"
                >
                  Assign tour
                </Button>
              </div>
            </CardAction>
          </div>
          {children}
        </div>
      </CardHeader>
    </Card>
  );
}
