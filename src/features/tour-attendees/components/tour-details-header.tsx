import { Link } from '@tanstack/react-router';
import { ChevronLeftIcon, PlusIcon } from 'lucide-react';
import type { ReactNode } from 'react';

import { Button } from '#/components/ui/button';
import { Card, CardAction, CardHeader } from '#/components/ui/card';

export function TourDetailsHeader({
  name,
  description,
  summary,
  onAddAttendee,
}: {
  name?: string;
  description?: string | null;
  startDate?: string;
  endDate?: string;
  summary: ReactNode;
  onAddAttendee: () => void;
}) {
  return (
    <Card className="overflow-hidden border-border/60 bg-card/80 shadow-sm backdrop-blur-sm">
      <CardHeader className="gap-6 p-4 sm:px-6">
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex min-w-0 flex-col gap-4">
              <Button
                render={<Link to="/tours" />}
                nativeButton={false}
                type="button"
                variant="link"
                className="h-auto w-fit gap-1 p-0 text-muted-foreground"
              >
                <ChevronLeftIcon data-icon="inline-start" />
                Back to tours
              </Button>
              <div className="flex max-w-3xl flex-col gap-3">
                <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
                  Tour details
                </p>
                <h1 className="font-heading text-3xl leading-none font-semibold tracking-tight sm:text-4xl lg:text-5xl">
                  {name ?? 'Tour details'}
                </h1>
                <p className="max-w-2xl text-balance text-muted-foreground">
                  {description ?? 'No description added for this tour yet.'}
                </p>
              </div>
            </div>
            <CardAction className="self-start">
              <Button
                onClick={onAddAttendee}
                size="lg"
                type="button"
                className="w-full sm:w-auto"
              >
                <PlusIcon data-icon="inline-start" />
                Add attendee
              </Button>
            </CardAction>
          </div>
          {summary}
        </div>
      </CardHeader>
    </Card>
  );
}
