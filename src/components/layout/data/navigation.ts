import {
  BellIcon,
  LayoutDashboardIcon,
  MapPinnedIcon,
  SettingsIcon,
  TicketsPlaneIcon,
  UsersIcon,
} from "lucide-react";

import type { NavItem } from "#/components/layout/types";

export const navigationItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboardIcon,
  },
  {
    title: "Clients",
    url: "/clients",
    icon: UsersIcon,
  },
  {
    title: "Tours",
    url: "/tours",
    icon: TicketsPlaneIcon,
  },
  {
    title: "Itineraries",
    url: "/itineraries",
    icon: MapPinnedIcon,
  },
  {
    title: "Reminders",
    url: "/reminders",
    icon: BellIcon,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: SettingsIcon,
  },
] satisfies NavItem[];
