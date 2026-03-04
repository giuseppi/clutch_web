import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';

export function useLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (creds: { email: string; password: string }) =>
      api.post('/auth/login', creds).then((r) => r.data),
    onSuccess: (data) => {
      localStorage.setItem('clutch_access_token', data.accessToken);
      localStorage.setItem('clutch_refresh_token', data.refreshToken);
      queryClient.setQueryData(['auth', 'me'], data.user);
    },
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (data: {
      email: string;
      password: string;
      firstName: string;
      lastName: string;
      role: 'COACH' | 'SCOUT' | 'ATHLETE';
      teamId?: string;
    }) => api.post('/auth/register', data).then((r) => r.data),
  });
}

export function useCurrentUser() {
  return useQuery({
    queryKey: ['auth', 'me'],
    queryFn: () => api.get('/auth/me').then((r) => r.data),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
