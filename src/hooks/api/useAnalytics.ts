import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export function useMatchAnalytics(matchId: string | undefined) {
  return useQuery({
    queryKey: ['analytics', 'match', matchId],
    queryFn: () => api.get(`/analytics/match/${matchId}`).then((r) => r.data),
    enabled: !!matchId,
  });
}

export function usePlayTags(matchId: string | undefined) {
  return useQuery({
    queryKey: ['analytics', 'tags', matchId],
    queryFn: () => api.get(`/analytics/match/${matchId}/tags`).then((r) => r.data),
    enabled: !!matchId,
  });
}

export function useCreatePlayTag() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      matchId: string;
      label: string;
      notes?: string;
      timestamp: number;
      statType?: string;
      playerId?: string;
    }) => api.post(`/analytics/match/${data.matchId}/tags`, data).then((r) => r.data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['analytics', 'tags', variables.matchId] });
    },
  });
}

export function useMatchHighlights(matchId: string | undefined) {
  return useQuery({
    queryKey: ['analytics', 'highlights', 'match', matchId],
    queryFn: () => api.get(`/analytics/match/${matchId}/highlights`).then((r) => r.data),
    enabled: !!matchId,
  });
}

export function usePlayerHighlights(playerId: string | undefined) {
  return useQuery({
    queryKey: ['analytics', 'highlights', 'player', playerId],
    queryFn: () => api.get(`/analytics/player/${playerId}/highlights`).then((r) => r.data),
    enabled: !!playerId,
  });
}
