'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { api } from '@/lib/api';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  
  const { register, handleSubmit, formState: { isSubmitting } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      setError(null);
      const response = await api.post('/admin/auth/login', data);
      localStorage.setItem('accessToken', response.data.accessToken);
      router.push('/system-console');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4">
      <div className="bg-[#121212] border border-[#222222] p-8 rounded-xl w-full max-w-md">
        <h1 className="text-2xl font-bold text-white mb-6">System Console</h1>
        
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-500 p-3 rounded-md mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-[#9CA3AF] text-sm mb-2">Email</label>
            <input
              {...register('email')}
              type="email"
              className="w-full bg-[#050505] border border-[#222222] text-white rounded-md px-4 py-2 focus:outline-none focus:border-[#EA580C]"
              placeholder="admin@portfolio.local"
            />
          </div>
          <div>
            <label className="block text-[#9CA3AF] text-sm mb-2">Password</label>
            <input
              {...register('password')}
              type="password"
              className="w-full bg-[#050505] border border-[#222222] text-white rounded-md px-4 py-2 focus:outline-none focus:border-[#EA580C]"
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#EA580C] hover:bg-[#F97316] text-white font-medium py-2 rounded-md transition-colors disabled:opacity-50"
          >
            {isSubmitting ? 'Authenticating...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
}
