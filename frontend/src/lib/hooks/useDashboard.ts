import { useQuery } from '@tanstack/react-query';
import { api } from '../api';

export function useDashboardSummary() {
  return useQuery({
    queryKey: ['admin-dashboard-summary'],
    queryFn: async () => {
      const { data } = await api.get('/admin/dashboard/summary');
      return data;
    },
  });
}

export function useDashboardMessages(limit: number = 5) {
  return useQuery({
    queryKey: ['admin-dashboard-messages', limit],
    queryFn: async () => {
      const { data } = await api.get(`/admin/messages?limit=${limit}`);
      return data;
    },
  });
}
