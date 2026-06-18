import { SearchIcon, XIcon } from 'lucide-react';

import { Button } from '#/components/ui/button';
import { Input } from '#/components/ui/input';

export function AttendeeSearch({
  searchTerm,
  onSearchTermChange,
  onClearSearch,
}: {
  searchTerm: string;
  onSearchTermChange: (value: string) => void;
  onClearSearch: () => void;
}) {
  return (
    <div className="relative">
      <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        aria-label="Search attendees"
        className="pl-9 pr-9"
        placeholder="Search client name, phone, or email"
        value={searchTerm}
        onChange={(event) => onSearchTermChange(event.target.value)}
      />
      {searchTerm ? (
        <Button
          aria-label="Clear search"
          className="absolute top-1/2 right-1 -translate-y-1/2"
          onClick={onClearSearch}
          size="icon-sm"
          type="button"
          variant="ghost"
        >
          <XIcon />
        </Button>
      ) : null}
    </div>
  );
}
