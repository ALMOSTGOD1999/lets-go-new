import { Link, useLocation } from "@tanstack/react-router";

import { navigationItems } from "#/components/layout/data/navigation";
import { cn } from "#/lib/utils";

export function MobileBottomNavigation() {
  const href = useLocation({ select: (location) => location.href });
  const pathname = href.split("?")[0];

  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-20 border-border border-t bg-background/95 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden"
    >
      <ul className="grid h-16 grid-cols-6">
        {navigationItems.map((item) => {
          const isActive = pathname === item.url;

          return (
            <li key={item.url} className="flex min-w-0">
              <Link
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-lg px-1 text-muted-foreground text-xs transition-colors hover:text-foreground",
                  isActive && "bg-muted font-medium text-foreground",
                )}
                to={item.url}
              >
                <item.icon />
                <span className="truncate">{item.title}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
