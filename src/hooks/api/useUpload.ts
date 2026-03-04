import { useMutation, useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export function usePresignedUrl() {
  return useMutation({
    mutationFn: (data: {
      matchId?: string;
      sessionId?: string;
      fileName: string;
      contentType: string;
      type: 'MATCH' | 'SESSION';
    }) => api.post('/upload/presign', data).then((r) => r.data),
  });
}

export function useConfirmUpload() {
  return useMutation({
    mutationFn: (data: {
      matchId?: string;
      sessionId?: string;
      s3Key: string;
      homeJerseyColor?: string;
      awayJerseyColor?: string;
      type: 'MATCH' | 'SESSION';
    }) => api.post('/upload/confirm', data).then((r) => r.data),
  });
}

export function useJobStatus(jobId: string | null) {
  return useQuery({
    queryKey: ['jobs', jobId],
    queryFn: () => api.get(`/jobs/${jobId}`).then((r) => r.data),
    enabled: !!jobId,
    refetchInterval: (query) => {
      const status = query.state.data?.status;
      if (status === 'COMPLETED' || status === 'FAILED') return false;
      return 3000; // Poll every 3 seconds while processing
    },
  });
}
