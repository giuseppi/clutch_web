import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

interface MatchListParams {
  teamId?: string;
  season?: string;
  page?: number;
  limit?: number;
}

export function useMatches(params?: MatchListParams) {
  return useQuery({
    queryKey: ['matches', params],
    queryFn: () => api.get('/matches', { params }).then((r) => r.data),
  });
}

export function useMatch(id: string | undefined) {
  return useQuery({
    queryKey: ['matches', id],
    queryFn: () => api.get(`/matches/${id}`).then((r) => r.data),
    enabled: !!id,
  });
}

export function useScheduledMatches() {
  return useQuery({
    queryKey: ['matches', 'scheduled'],
    queryFn: () => api.get('/matches/scheduled').then((r) => r.data),
  });
}

export function useCreateMatch() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      scheduledDate: string;
      venue?: string;
      homeTeamId: string;
      awayTeamId: string;
      season: string;
      matchCode: string;
    }) => api.post('/matches', data).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['matches'] });
    },
  });
}
