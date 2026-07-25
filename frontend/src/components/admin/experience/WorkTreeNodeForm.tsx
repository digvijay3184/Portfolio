'use client';

import { useForm } from 'react-hook-form';
import { WorkNode } from '@/lib/tree/buildTree';
import { useEffect } from 'react';

interface WorkTreeNodeFormProps {
  initialData?: Partial<WorkNode>;
  onSubmit: (data: Partial<WorkNode>) => void;
  onCancel: () => void;
}

export default function WorkTreeNodeForm({ initialData, onSubmit, onCancel }: WorkTreeNodeFormProps) {
  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      label: initialData?.label || '',
      description: initialData?.description || '',
      type: initialData?.type || 'task',
      icon: initialData?.icon || '',
      techStack: initialData?.techStack ? initialData.techStack.join(', ') : '',
    }
  });

  useEffect(() => {
    if (initialData) {
      reset({
        label: initialData.label || '',
        description: initialData.description || '',
        type: initialData.type || 'task',
        icon: initialData.icon || '',
        techStack: initialData.techStack ? initialData.techStack.join(', ') : '',
      });
    }
  }, [initialData, reset]);

  const handleFormSubmit = (data: any) => {
    const formattedData: Partial<WorkNode> = {
      ...data,
      techStack: data.techStack
        ? data.techStack.split(',').map((t: string) => t.trim()).filter(Boolean)
        : []
    };
    onSubmit(formattedData);
  };

  return (
    <div className="space-y-4 bg-[#121212] p-4 rounded-xl border border-[#333]">
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-sm text-[#9CA3AF] mb-1">Label *</label>
          <input
            {...register('label', { required: true, minLength: 1, maxLength: 120 })}
            className="w-full bg-[#050505] border border-[#222222] text-white rounded-md px-3 py-1.5 focus:border-[#EA580C]"
            placeholder="e.g. Payments Rewrite"
          />
        </div>
        
        <div className="col-span-2">
          <label className="block text-sm text-[#9CA3AF] mb-1">Description</label>
          <textarea
            {...register('description')}
            rows={2}
            className="w-full bg-[#050505] border border-[#222222] text-white rounded-md px-3 py-1.5 focus:border-[#EA580C]"
          />
        </div>

        <div>
          <label className="block text-sm text-[#9CA3AF] mb-1">Type</label>
          <select
            {...register('type')}
            className="w-full bg-[#050505] border border-[#222222] text-white rounded-md px-3 py-1.5 focus:border-[#EA580C]"
          >
            <option value="project">Project</option>
            <option value="feature">Feature</option>
            <option value="task">Task</option>
            <option value="milestone">Milestone</option>
          </select>
        </div>

        <div>
          <label className="block text-sm text-[#9CA3AF] mb-1">Icon (Lucide name)</label>
          <input
            {...register('icon')}
            className="w-full bg-[#050505] border border-[#222222] text-white rounded-md px-3 py-1.5 focus:border-[#EA580C]"
            placeholder="e.g. credit-card"
          />
        </div>


        <div className="col-span-2">
          <label className="block text-sm text-[#9CA3AF] mb-1">Tech Stack (comma separated)</label>
          <input
            {...register('techStack')}
            className="w-full bg-[#050505] border border-[#222222] text-white rounded-md px-3 py-1.5 focus:border-[#EA580C]"
            placeholder="e.g. React, NestJS, MongoDB"
          />
        </div>
      </div>
      
      <div className="flex justify-end gap-2 mt-4">
        <button
          type="button"
          onClick={onCancel}
          className="text-[#9CA3AF] hover:text-white px-4 py-1.5 rounded-md"
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={handleSubmit(handleFormSubmit)}
          className="bg-[#EA580C] hover:bg-[#F97316] text-white px-4 py-1.5 rounded-md"
        >
          Save Node
        </button>
      </div>
    </div>
  );
}
