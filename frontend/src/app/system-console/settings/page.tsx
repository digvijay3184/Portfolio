'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useContent } from '@/lib/hooks/useContent';
import toast from 'react-hot-toast';
import { Loader2, Save } from 'lucide-react';

export default function SettingsAdminPage() {
  const { data: settingsData, isLoading, create, update } = useContent('site-settings');

  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm({
    defaultValues: {
      customCursorEnabled: true,
      showDashboardStats: true,
      showRecentMessages: true,
      showContentCompleteness: true,
      showQuickActions: true,
      showActivityLog: true,
      showAboutSection: true,
      showMindsetSection: true,
      showExperienceSection: true,
      showProjectsSection: true,
      showArchitectureSection: true,
      showContactSection: true,
    }
  });

  const settingsDoc = settingsData?.[0];

  useEffect(() => {
    if (settingsDoc) {
      reset({
        customCursorEnabled: settingsDoc.customCursorEnabled ?? true,
        showDashboardStats: settingsDoc.showDashboardStats ?? true,
        showRecentMessages: settingsDoc.showRecentMessages ?? true,
        showContentCompleteness: settingsDoc.showContentCompleteness ?? true,
        showQuickActions: settingsDoc.showQuickActions ?? true,
        showActivityLog: settingsDoc.showActivityLog ?? true,
        showAboutSection: settingsDoc.showAboutSection ?? true,
        showMindsetSection: settingsDoc.showMindsetSection ?? true,
        showExperienceSection: settingsDoc.showExperienceSection ?? true,
        showProjectsSection: settingsDoc.showProjectsSection ?? true,
        showArchitectureSection: settingsDoc.showArchitectureSection ?? true,
        showContactSection: settingsDoc.showContactSection ?? true,
      });
    }
  }, [settingsDoc, reset]);

  const onSubmit = async (payload: any) => {
    try {
      if (settingsDoc?._id) {
        await update({ id: settingsDoc._id, data: payload });
      } else {
        await create(payload);
      }
      toast.success('Settings saved successfully');
    } catch (err) {
      toast.error('Failed to save settings');
    }
  };

  const ToggleSwitch = ({ label, name }: { label: string, name: string }) => (
    <div className="flex items-center justify-between py-3 border-b border-[#222222] last:border-0">
      <span className="text-sm text-white font-medium">{label}</span>
      <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" {...register(name as any)} className="sr-only peer" />
        <div className="w-11 h-6 bg-[#222222] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#EA580C]"></div>
      </label>
    </div>
  );

  if (isLoading) {
    return <div className="flex items-center gap-2 text-[#9CA3AF]"><Loader2 className="animate-spin" /> Loading Settings...</div>;
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">System Settings</h1>
        <p className="text-[#9CA3AF]">Configure the appearance and functionality of both your admin dashboard and the live portfolio site.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Dashboard Settings */}
          <div>
            <h2 className="text-lg font-bold text-white mb-4">Dashboard Widgets</h2>
            <div className="bg-[#121212] border border-[#222222] rounded-xl px-5 py-2">
              <ToggleSwitch label="Show Stats Row" name="showDashboardStats" />
              <ToggleSwitch label="Show Recent Messages" name="showRecentMessages" />
              <ToggleSwitch label="Show Content Completeness" name="showContentCompleteness" />
              <ToggleSwitch label="Show Quick Actions" name="showQuickActions" />
              <ToggleSwitch label="Show Recent Activity Log" name="showActivityLog" />
            </div>
          </div>

          {/* Global UI Settings */}
          <div className="md:col-span-2">
            <h2 className="text-lg font-bold text-white mb-4">Global UI Settings</h2>
            <div className="bg-[#121212] border border-[#222222] rounded-xl px-5 py-2 max-w-md">
              <ToggleSwitch label="Enable Custom Mouse Cursor" name="customCursorEnabled" />
            </div>
          </div>
          
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex items-center gap-2 bg-[#EA580C] hover:bg-[#F97316] text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
          Save Configuration
        </button>
      </form>
    </div>
  );
}
