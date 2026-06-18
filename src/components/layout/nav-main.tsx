import { Link, useLocation } from '@tanstack/react-router';

import { navigationItems } from '#/components/layout/data/navigation';
import type { NavItem } from '#/components/layout/types';
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '#/components/ui/sidebar';

export function NavMain() {
  const href = useLocation({ select: (location) => location.href });

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Navigation</SidebarGroupLabel>
      <SidebarMenu>
        {navigationItems.map((item) => (
          <SidebarMenuItem key={item.url}>
            <SidebarMenuButton
              isActive={checkIsActive(href, item)}
              render={<Link to={item.url} />}
              tooltip={item.title}
            >
              <item.icon />
              <span>{item.title}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

function checkIsActive(href: string, item: NavItem) {
  const pathname = href.split('?')[0];

  return pathname === item.url;
}
