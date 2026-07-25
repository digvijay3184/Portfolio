'use client';

import { useState, useRef } from 'react';
import { Send, CheckCircle, XCircle, Loader2, Copy } from 'lucide-react';
import { motion } from 'framer-motion';
import { api } from '@/lib/api';
import { useMagneticHover } from '@/lib/hooks/useMagneticHover';

export default function Contact() {
  const CONTACT_EMAIL = 'digvijaysingh4040@gmail.com';
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { x, y } = useMagneticHover(buttonRef, 0.3, 15);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await api.post('/contact', formData);
      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <section className="py-24 bg-[#050505] text-white border-t border-[#222222]">
      <div className="container mx-auto px-6 max-w-2xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Let's Connect</h2>
          <p className="text-[#9CA3AF] mb-6">
            Have a project in mind or want to discuss engineering architecture?
            I'm always open to talking about new opportunities.
          </p>
          <div className="flex items-center justify-center gap-2">
            <span className="text-[#EA580C] font-mono bg-[#EA580C]/10 px-3 py-1 rounded-md border border-[#EA580C]/20">
              {CONTACT_EMAIL}
            </span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(CONTACT_EMAIL);
                import('react-hot-toast').then(({ default: toast }) => toast.success('Email copied!'));
              }}
              className="p-1.5 text-[#9CA3AF] hover:text-white hover:bg-[#222222] rounded-md transition-colors"
              title="Copy to clipboard"
            >
              <Copy size={16} />
            </button>
          </div>
        </div>

        <div className="glass-panel p-8 rounded-2xl relative overflow-hidden">
          {status === 'success' && (
            <div className="absolute inset-0 bg-[#050505]/90 backdrop-blur flex flex-col items-center justify-center z-10 animate-in fade-in">
              <CheckCircle size={48} className="text-[#EA580C] mb-4" />
              <h3 className="text-xl font-bold mb-2">Message Sent</h3>
              <p className="text-[#9CA3AF]">I'll get back to you shortly.</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#9CA3AF] mb-2">Name</label>
              <input
                required
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full bg-[#121212] border border-[#222222] text-white rounded-lg px-4 py-3 focus:outline-none focus:border-[#EA580C] transition-colors"
                placeholder="John Doe"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[#9CA3AF] mb-2">Email</label>
              <input
                required
                type="email"
                value={formData.email}
                onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                className="w-full bg-[#121212] border border-[#222222] text-white rounded-lg px-4 py-3 focus:outline-none focus:border-[#EA580C] transition-colors"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#9CA3AF] mb-2">Message</label>
              <textarea
                required
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData(prev => ({ ...prev, message: e.target.value }))}
                className="w-full bg-[#121212] border border-[#222222] text-white rounded-lg px-4 py-3 focus:outline-none focus:border-[#EA580C] transition-colors resize-none"
                placeholder="Your message..."
              />
            </div>

            <motion.button
              ref={buttonRef}
              style={{ x, y }}
              type="submit"
              disabled={status === 'loading'}
              className="w-full glass-button flex items-center justify-center gap-2 py-4 rounded-lg font-medium text-lg disabled:opacity-50"
            >
              {status === 'loading' ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Sending...
                </>
              ) : status === 'error' ? (
                <>
                  <XCircle size={20} />
                  Failed. Try Again?
                </>
              ) : (
                <>
                  <Send size={20} />
                  Send Message
                </>
              )}
            </motion.button>
          </form>
        </div>
      </div>
    </section>
  );
}
