import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

interface PlayerListParams {
  teamId?: string;
  position?: string;
  gradYear?: number;
  search?: string;
  page?: number;
  limit?: number;
}

export function usePlayers(params?: PlayerListParams) {
  return useQuery({
    queryKey: ['players', params],
    queryFn: () => api.get('/players', { params }).then((r) => r.data),
  });
}

export function usePlayer(id: string | undefined) {
  return useQuery({
    queryKey: ['players', id],
    queryFn: () => api.get(`/players/${id}`).then((r) => r.data),
    enabled: !!id,
  });
}

export function usePlayerEloHistory(id: string | undefined) {
  return useQuery({
    queryKey: ['players', id, 'elo-history'],
    queryFn: () => api.get(`/players/${id}/elo-history`).then((r) => r.data),
    enabled: !!id,
  });
}

export function usePlayerStats(id: string | undefined) {
  return useQuery({
    queryKey: ['players', id, 'stats'],
    queryFn: () => api.get(`/players/${id}/stats`).then((r) => r.data),
    enabled: !!id,
  });
}

export function useCreatePlayer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      firstName: string;
      lastName: string;
      position: string;
      graduationYear: number;
      teamId: string;
      jerseyNumber?: string;
      heightInches?: number;
      weightLbs?: number;
    }) => api.post('/players', data).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['players'] });
    },
  });
}
