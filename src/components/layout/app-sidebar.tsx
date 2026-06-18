import { NavMain } from '#/components/layout/nav-main';
import { NavUser } from '#/components/layout/nav-user';
import type { AuthenticatedUser } from '#/components/layout/types';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '#/components/ui/sidebar';

type AppSidebarProps = React.ComponentProps<typeof Sidebar> & {
  user: AuthenticatedUser;
};

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <div className="flex h-10 items-center gap-2 rounded-lg px-2 font-semibold text-sidebar-foreground">
          <img src="/logo.svg" alt="LetsGo" className="size-8" />
          <span className="truncate group-data-[collapsible=icon]:hidden">
            LetsGo
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <NavMain />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
