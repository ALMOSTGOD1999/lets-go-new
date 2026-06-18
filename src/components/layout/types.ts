import type { LinkProps } from '@tanstack/react-router';
import type { ElementType } from 'react';

type NavItem = {
  title: string;
  url: LinkProps['to'];
  icon: ElementType;
};

type AuthenticatedUser = {
  name: string;
  email: string;
  image?: string | null;
};

export type { AuthenticatedUser, NavItem };
