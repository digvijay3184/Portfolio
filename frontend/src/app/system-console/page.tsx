'use client';

import Link from 'next/link';
import { useDashboardSummary, useDashboardMessages } from '@/lib/hooks/useDashboard';
import { useContent } from '@/lib/hooks/useContent';
import { 
  FolderGit2, 
  Mail, 
  Briefcase, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Plus, 
  Edit2, 
  ExternalLink 
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import LiveSiteManager from '@/components/admin/LiveSiteManager';
import { motion } from 'framer-motion';
import React from 'react';
import { useMagneticHover } from '@/lib/hooks/useMagneticHover';

function MagneticQuickAction({ href, icon: Icon, label, isExternal = false }: { href: string, icon: any, label: string, isExternal?: boolean }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const { x, y } = useMagneticHover(ref, 0.2, 10);
  
  const content = (
    <motion.div 
      ref={ref}
      style={{ x, y }}
      className="flex flex-col items-center justify-center p-4 bg-[#121212] border border-[#222222] hover:bg-[#1a1a1a] hover:border-[#EA580C]/50 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-[#EA580C] focus:ring-offset-2 focus:ring-offset-[#050505] w-full h-full cursor-pointer"
      data-cursor="button"
    >
      <Icon size={24} className="text-[#EA580C] mb-2" />
      <span className="text-sm font-medium text-white text-center">{label}</span>
    </motion.div>
  );

  if (isExternal) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className="block">
        {content}
      </a>
    );
  }
  return (
    <Link href={href} className="block">
      {content}
    </Link>
  );
}

export default function SystemConsolePage() {
  const { data: summary, isLoading: isLoadingSummary } = useDashboardSummary();
  const { data: messages, isLoading: isLoadingMessages } = useDashboardMessages(5);
  const { data: settingsData } = useContent('site-settings');
  const settings = settingsData?.[0] || {};

  if (isLoadingSummary || isLoadingMessages) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-24 bg-[#121212] border border-[#222222] rounded-xl" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-3 h-96 bg-[#121212] border border-[#222222] rounded-xl" />
          <div className="lg:col-span-2 h-96 bg-[#121212] border border-[#222222] rounded-xl" />
        </div>
      </div>
    );
  }

  const { stats, completeness, recentActivity } = summary || {};

  const checklist = [
    { label: 'Hero', isComplete: completeness?.hero },
    { label: 'About', isComplete: completeness?.about },
    { label: 'Engineering Mindset', isComplete: completeness?.mindset },
    { label: 'Experience', isComplete: completeness?.experience },
    { label: 'Projects', isComplete: completeness?.projects },
    { label: 'Architecture', isComplete: completeness?.architecture },
    { label: 'CV', isComplete: completeness?.cv },
  ];

  return (
    <div className="space-y-8">
      {/* Top Bar: Stats & Quick Actions */}
      <div className="flex flex-col lg:flex-row gap-8">
        
        {settings.showDashboardStats !== false && (
          <div className="flex-1 lg:max-w-xs bg-[#121212] border border-[#222222] p-5 rounded-xl flex items-center justify-between">
            <div>
              <p className="text-sm text-[#9CA3AF] mb-1">Total Projects</p>
              <p className="text-2xl font-bold text-white">
                {stats?.publishedProjects || 0} <span className="text-sm text-[#9CA3AF] font-normal">/ {stats?.draftProjects || 0} draft</span>
              </p>
            </div>
            <div className="bg-black/50 p-3 rounded-lg text-[#EA580C]">
              <FolderGit2 size={24} />
            </div>
          </div>
        )}

        {settings.showQuickActions !== false && (
          <div className="flex-1 flex flex-col justify-center">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 h-full">
              <MagneticQuickAction href="/system-console/projects" icon={Plus} label="New Project" />
              <MagneticQuickAction href="/system-console/experience" icon={Plus} label="New Experience" />
              <MagneticQuickAction href="/system-console/hero" icon={Edit2} label="Edit Hero" />
              <MagneticQuickAction href="/" icon={ExternalLink} label="View Live Site" isExternal={true} />
            </div>
          </div>
        )}
      </div>

      {/* Main Two Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* Left Column: Messages Preview (60%) */}
        {settings.showRecentMessages !== false && (
          <div className="lg:col-span-3 space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-white">Recent Messages</h3>
            <Link href="/system-console/messages" className="text-sm text-[#FBBF24] hover:text-[#fcd34d] font-medium transition-colors">
              View all
            </Link>
          </div>
          <div className="bg-[#121212] border border-[#222222] rounded-xl overflow-hidden">
            {messages && messages.length > 0 ? (
              <div className="divide-y divide-[#222222]">
                {messages.map((msg: any) => (
                  <div key={msg._id} className="p-4 hover:bg-[#1a1a1a] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-white truncate">{msg.name}</span>
                        <span className="text-sm text-[#9CA3AF] hidden sm:inline">&middot; {msg.email}</span>
                      </div>
                      <p className="text-sm text-[#9CA3AF] truncate">
                        {msg.message.length > 80 ? msg.message.substring(0, 80) + '...' : msg.message}
                      </p>
                    </div>
                    <div className="flex items-center justify-between sm:flex-col sm:items-end gap-2 shrink-0">
                      <span className="text-xs text-[#9CA3AF]">
                        {formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}
                      </span>
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                        msg.status === 'new' ? 'bg-[#EA580C]/20 text-[#EA580C] border border-[#EA580C]/30' : 
                        msg.status === 'read' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' : 
                        'bg-[#222222] text-[#9CA3AF] border border-[#333333]'
                      }`}>
                        {msg.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 text-center text-[#9CA3AF]">
                No messages found.
              </div>
            )}
          </div>
        </div>
        )}

        {/* Right Column: Completeness & Quick Actions (40%) */}
        <div className="lg:col-span-2 space-y-8">
          <LiveSiteManager />

          {settings.showContentCompleteness !== false && (
          <div>
            <h3 className="text-lg font-bold text-white mb-4">Content Completeness</h3>
            <div className="bg-[#121212] border border-[#222222] rounded-xl p-4">
              <div className="space-y-3">
                {checklist.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center">
                    <span className="text-sm font-medium text-[#e5e7eb]">{item.label}</span>
                    {item.isComplete ? (
                      <div className="flex items-center gap-1.5 text-green-500">
                        <CheckCircle2 size={16} />
                        <span className="text-xs font-bold uppercase tracking-wider">Complete</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-red-500">
                        <XCircle size={16} />
                        <span className="text-xs font-bold uppercase tracking-wider">Incomplete</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          )}

        </div>
      </div>

      {/* Recent Activity Log - Terminal Style */}
      {settings.showActivityLog !== false && (
        <div className="mt-8">
        <h3 className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider mb-4">Recent Activity Log</h3>
        <div className="bg-[#050505] border border-[#222222] rounded-xl overflow-hidden font-mono text-sm shadow-inner">
          {/* Terminal Header */}
          <div className="bg-[#121212] border-b border-[#222222] px-4 py-2 flex items-center gap-2">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
            </div>
            <span className="text-[#6B7280] text-xs ml-2">syslog &mdash; admin@portfolio</span>
          </div>
          
          {/* Terminal Body */}
          <div className="p-4 space-y-2 max-h-[250px] overflow-y-auto">
            <div className="text-[#9CA3AF] mb-4">
              <span className="text-green-500 font-bold">➜</span> <span className="text-blue-400 font-bold">~</span> tail -n 10 /var/log/activity.log
            </div>
            {recentActivity && recentActivity.length > 0 ? (
              recentActivity.map((activity: any, idx: number) => (
                <div key={idx} className="flex flex-col sm:flex-row sm:items-center gap-x-3 gap-y-1 text-[#9CA3AF] hover:bg-[#121212] px-2 py-1 -mx-2 rounded transition-colors">
                  <span className="text-[#6B7280] shrink-0">
                    [{new Date(activity.updatedAt).toISOString().replace('T', ' ').substring(0, 19)}]
                  </span>
                  <span className="text-[#EA580C] uppercase text-xs font-bold tracking-wider">[{activity.collectionType}]</span>
                  <span className="text-white">&apos;{activity.title}&apos;</span>
                  <span className="text-[#6B7280]">updated {formatDistanceToNow(new Date(activity.updatedAt), { addSuffix: true })}</span>
                </div>
              ))
            ) : (
              <div className="text-[#6B7280] mt-2">No recent activity detected in the system.</div>
            )}
            <div className="flex items-center gap-2 mt-4 pt-2">
              <span className="text-green-500 font-bold">➜</span> <span className="text-blue-400 font-bold">~</span>
              <div className="animate-pulse w-2 h-4 bg-[#EA580C]"></div>
            </div>
          </div>
        </div>
        </div>
      )}

    </div>
  )
}
