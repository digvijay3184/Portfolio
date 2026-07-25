import { useMutation } from '@tanstack/react-query';
import { api } from '../api';

export function useMediaUpload() {
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('file', file);
      const res = await api.post('/admin/media/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data as { url: string; publicId: string };
    },
  });
}

export function useMediaDelete() {
  return useMutation({
    mutationFn: async (publicId: string) => {
      const res = await api.delete(`/admin/media`, {
        params: { publicId },
      });
      return res.data;
    },
  });
}
