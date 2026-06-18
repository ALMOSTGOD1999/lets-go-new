import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';

import {
  deletePushSubscription,
  getVapidPublicKey,
  pushSubscriptionSchema,
  savePushSubscription,
} from '#/features/reminders/server/web-push';

const deleteSubscriptionSchema = z.object({ endpoint: z.url() });

export const Route = createFileRoute('/api/reminders/push-subscription')({
  server: {
    handlers: {
      GET: () => {
        const publicKey = getVapidPublicKey();

        if (!publicKey) {
          return Response.json(
            { error: 'VAPID_PUBLIC_KEY is not configured' },
            { status: 500 },
          );
        }

        return Response.json({ publicKey });
      },
      POST: async ({ request }) => {
        const { getAuth } = await import('#/lib/auth.server');
        const session = await getAuth().api.getSession({
          headers: request.headers,
        });

        if (!session?.user?.id) {
          return new Response('Unauthorized', { status: 401 });
        }

        const subscription = pushSubscriptionSchema.parse(await request.json());
        await savePushSubscription({
          userId: session.user.id,
          userAgent: request.headers.get('user-agent'),
          subscription,
        });

        return Response.json({ ok: true }, { status: 201 });
      },
      DELETE: async ({ request }) => {
        const { getAuth } = await import('#/lib/auth.server');
        const session = await getAuth().api.getSession({
          headers: request.headers,
        });

        if (!session?.user?.id) {
          return new Response('Unauthorized', { status: 401 });
        }

        const { endpoint } = deleteSubscriptionSchema.parse(
          await request.json(),
        );
        await deletePushSubscription(endpoint, session.user.id);

        return Response.json({ ok: true });
      },
    },
  },
});
