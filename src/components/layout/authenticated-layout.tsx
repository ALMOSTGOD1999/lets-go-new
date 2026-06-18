import { Outlet, useRouteContext } from '@tanstack/react-router';

import { AppSidebar } from '#/components/layout/app-sidebar';
import { MobileBottomNavigation } from '#/components/layout/mobile-bottom-navigation';
import { SidebarInset, SidebarProvider } from '#/components/ui/sidebar';
import { RemindersRuntime } from '#/features/reminders/components/reminders-runtime';

export function AuthenticatedLayout() {
  const { user } = useRouteContext({ from: '/_authenticated' });

  return (
    <SidebarProvider>
      <AppSidebar user={user} />
      <SidebarInset className="pb-16 md:pb-0">
        <Outlet />
      </SidebarInset>
      <MobileBottomNavigation />
      <RemindersRuntime />
    </SidebarProvider>
  );
}
