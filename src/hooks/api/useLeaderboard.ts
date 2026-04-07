import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export interface LeaderboardParams {
  state?: string;
  classification?: string;
  gradYear?: number;
  position?: string;
  search?: string;
  sortBy?: string;
  page?: number;
  limit?: number;
}

export function useLeaderboard(params: LeaderboardParams) {
  return useQuery({
    queryKey: ['leaderboard', params],
    queryFn: () => api.get('/leaderboard', { params }).then((r) => r.data),
    placeholderData: (prev) => prev, // Keep previous data while loading
  });
}
