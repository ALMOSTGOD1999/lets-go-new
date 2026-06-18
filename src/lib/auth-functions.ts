import { createServerFn } from '@tanstack/react-start';
import { getRequestHeaders } from '@tanstack/react-start/server';

export const getSession = createServerFn({ method: 'GET' }).handler(
  async () => {
    const headers = getRequestHeaders();
    const { getAuth } = await import('#/lib/auth.server');

    return getAuth().api.getSession({ headers });
  },
);
