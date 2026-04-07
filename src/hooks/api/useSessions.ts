import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export function useSessions(params?: { type?: string; page?: number; limit?: number }) {
  return useQuery({
    queryKey: ['sessions', params],
    queryFn: () => api.get('/sessions', { params }).then((r) => r.data),
  });
}

export function useSession(id: string | undefined) {
  return useQuery({
    queryKey: ['sessions', id],
    queryFn: () => api.get(`/sessions/${id}`).then((r) => r.data),
    enabled: !!id,
  });
}

export function useCreateSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      title: string;
      sessionType: 'PRACTICE' | 'SCRIMMAGE' | 'TRAINING';
      date: string;
      notes?: string;
    }) => api.post('/sessions', data).then((r) => r.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sessions'] });
    },
  });
}
