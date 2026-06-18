import { useQuery } from '@tanstack/react-query';

import { getDashboardMetrics } from '#/features/dashboard/server/functions';

export const dashboardQueryKey = ['dashboard', 'metrics'];

export function useDashboardMetrics() {
  return useQuery({
    queryKey: dashboardQueryKey,
    queryFn: () => getDashboardMetrics(),
    enabled: typeof window !== 'undefined',
  });
}
