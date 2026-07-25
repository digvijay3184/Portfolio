'use client';

import { useContent } from '@/lib/hooks/useContent';
import { Trash2 } from 'lucide-react';

export default function MessagesAdminPage() {
  const { data: messages, isLoading, remove } = useContent('contact-message');

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-white">Contact Messages</h2>
      
      <div className="space-y-4">
        {messages?.map((msg: any) => (
          <div key={msg._id} className="bg-[#121212] border border-[#222222] p-6 rounded-xl relative">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h4 className="font-bold text-white text-lg">{msg.name}</h4>
                <a href={`mailto:${msg.email}`} className="text-[#EA580C] hover:underline text-sm">{msg.email}</a>
                <span className="block text-xs text-[#9CA3AF] mt-1">{new Date(msg.createdAt).toLocaleString()}</span>
              </div>
              <button onClick={() => remove(msg._id)} className="text-red-500 hover:text-red-400 p-2">
                <Trash2 size={18} />
              </button>
            </div>
            <div className="text-[#9CA3AF] bg-[#050505] p-4 rounded-lg border border-[#222222] whitespace-pre-wrap">
              {msg.message}
            </div>
          </div>
        ))}
        {messages?.length === 0 && <p className="text-[#9CA3AF]">No messages received yet.</p>}
      </div>
    </div>
  );
}
