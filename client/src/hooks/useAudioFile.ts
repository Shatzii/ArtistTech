import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import type { AudioFile } from "@shared/schema";

export function useAudioFiles() {
  const { data: audioFiles = [], isLoading } = useQuery<AudioFile[]>({
    queryKey: ["/api/audio-files"],
  });

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('name', file.name);
      
      const response = await apiRequest('POST', '/api/audio-files', formData);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/audio-files"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/audio-files/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/audio-files"] });
    },
  });

  return {
    audioFiles,
    isLoading,
    uploadAudioFile: uploadMutation.mutateAsync,
    deleteAudioFile: deleteMutation.mutateAsync,
    isUploading: uploadMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}
