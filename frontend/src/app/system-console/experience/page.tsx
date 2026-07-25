'use client';

import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useContent } from '@/lib/hooks/useContent';
import { Trash2, Edit2, X } from 'lucide-react';
import JsonImporter from '@/components/admin/JsonImporter';
import { experienceSchema } from '@/lib/validations/jsonSchemas';
import toast from 'react-hot-toast';
import WorkTreeEditor from '@/components/admin/experience/WorkTreeEditor';
import { WorkNode } from '@/lib/tree/buildTree';

const experienceExampleTemplate = `{
  "company": "Google",
  "role": "Senior Engineer",
  "startDate": "2020-05-01",
  "endDate": "2024-01-01",
  "achievements": [
    "Led the frontend architecture rewrite",
    "Improved performance by 40%"
  ],
  "workTree": [
    {
      "nodeId": "root_1",
      "parentId": null,
      "label": "Frontend Rewrite",
      "description": "Led the rewrite of the main dashboard",
      "type": "project",
      "order": 0
    }
  ]
}`;

export default function ExperienceAdminPage() {
  const { data: experiences, isLoading, create, remove, update } = useContent('experience');
  const { register, handleSubmit, reset } = useForm();
  const [newWorkTree, setNewWorkTree] = useState<WorkNode[]>([]);
  
  const [editingExp, setEditingExp] = useState<any>(null);
  const [editWorkTree, setEditWorkTree] = useState<WorkNode[]>([]);
  const { register: registerEdit, handleSubmit: handleSubmitEdit, reset: resetEdit } = useForm();

  const handleJsonImport = (validatedData: any) => {
    reset({
      ...validatedData,
      achievements: Array.isArray(validatedData.achievements) 
        ? validatedData.achievements.join('\n') 
        : validatedData.achievements
    });
    if (validatedData.workTree) {
      setNewWorkTree(validatedData.workTree);
    }
    toast.success('JSON imported successfully');
  };
  
  const onSubmit = async (payload: any) => {
    try {
      const formattedPayload = {
        ...payload,
        achievements: payload.achievements.split('\n').map((a: string) => a.trim()).filter(Boolean),
        workTree: newWorkTree,
      };
      
      await create(formattedPayload);
      reset();
      setNewWorkTree([]);
      toast.success('Experience added!');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || err.message || 'Failed to add experience');
    }
  };

  const openEditModal = (exp: any) => {
    setEditingExp(exp);
    setEditWorkTree(exp.workTree || []);
    resetEdit({
      company: exp.company,
      role: exp.role,
      startDate: exp.startDate ? exp.startDate.split('T')[0] : '',
      endDate: exp.endDate ? exp.endDate.split('T')[0] : '',
      achievements: exp.achievements.join('\n')
    });
  };

  const onEditSubmit = async (payload: any) => {
    try {
      const formattedPayload = {
        ...payload,
        achievements: payload.achievements.split('\n').map((a: string) => a.trim()).filter(Boolean),
        workTree: editWorkTree,
      };
      await update({ id: editingExp._id, data: formattedPayload });
      setEditingExp(null);
      setEditWorkTree([]);
      toast.success('Experience updated!');
    } catch (err: any) {
      const errorMessage = Array.isArray(err?.response?.data?.message) 
        ? err.response.data.message[0] 
        : err?.response?.data?.message || err.message || 'Failed to update experience';
      toast.error(`Failed to update: ${errorMessage}`);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await remove(id);
      toast.success('Experience deleted');
    } catch (err) {
      toast.error('Failed to delete experience');
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Manage Experience</h2>
        <JsonImporter schema={experienceSchema} onValidData={handleJsonImport} label="Import Exp JSON" exampleTemplate={experienceExampleTemplate} />
      </div>
      
      <div className="bg-[#121212] border border-[#222222] p-6 rounded-xl">
        <h3 className="text-lg font-medium text-white mb-4">Add New Experience</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-[#9CA3AF] mb-2">Company Name</label>
              <input {...register('company')} required className="w-full bg-[#050505] border border-[#222222] text-white rounded-md px-4 py-2 focus:border-[#EA580C]" />
            </div>
            <div>
              <label className="block text-sm text-[#9CA3AF] mb-2">Role</label>
              <input {...register('role')} required className="w-full bg-[#050505] border border-[#222222] text-white rounded-md px-4 py-2 focus:border-[#EA580C]" />
            </div>
            <div>
              <label className="block text-sm text-[#9CA3AF] mb-2">Start Date (e.g. 2021-01)</label>
              <input {...register('startDate')} required type="date" className="w-full bg-[#050505] border border-[#222222] text-white rounded-md px-4 py-2 focus:border-[#EA580C]" />
            </div>
            <div>
              <label className="block text-sm text-[#9CA3AF] mb-2">End Date (leave blank if current)</label>
              <input {...register('endDate')} type="date" className="w-full bg-[#050505] border border-[#222222] text-white rounded-md px-4 py-2 focus:border-[#EA580C]" />
            </div>
          </div>
          <div>
            <label className="block text-sm text-[#9CA3AF] mb-2">Achievements (One per line)</label>
            <textarea {...register('achievements')} required rows={4} className="w-full bg-[#050505] border border-[#222222] text-white rounded-md px-4 py-2 focus:border-[#EA580C]" />
          </div>

          <div className="pt-4 border-t border-[#222222]">
            <h4 className="text-lg font-medium text-white mb-4">Work Breakdown</h4>
            <WorkTreeEditor nodes={newWorkTree} onChange={setNewWorkTree} />
          </div>
          <button type="submit" className="bg-[#EA580C] hover:bg-[#F97316] text-white px-6 py-2 rounded-md">
            Add Experience
          </button>
        </form>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white">Existing Experiences</h3>
        {experiences?.map((exp: any) => (
          <div key={exp._id} className="bg-[#121212] border border-[#222222] p-4 rounded-xl flex justify-between items-start">
            <div>
              <h4 className="font-bold text-white">{exp.role} @ {exp.company}</h4>
              <p className="text-sm text-[#9CA3AF]">{new Date(exp.startDate).getFullYear()} - {exp.endDate ? new Date(exp.endDate).getFullYear() : 'Present'}</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => openEditModal(exp)} className="text-[#EA580C] hover:text-[#F97316] p-2">
                <Edit2 size={18} />
              </button>
              <button onClick={() => handleDelete(exp._id)} className="text-red-500 hover:text-red-400 p-2">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
        {experiences?.length === 0 && <p className="text-[#9CA3AF]">No experiences added yet.</p>}
      </div>

      {editingExp && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#121212] border border-[#333333] p-6 rounded-xl w-full max-w-2xl relative shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-white text-lg font-semibold flex items-center gap-2">
                <Edit2 size={20} className="text-[#EA580C]" />
                Edit Experience
              </h3>
              <button 
                type="button"
                onClick={() => setEditingExp(null)}
                className="text-[#9CA3AF] hover:text-white p-1 rounded-md"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmitEdit(onEditSubmit)} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-[#9CA3AF] mb-2">Company Name</label>
                  <input {...registerEdit('company')} required className="w-full bg-[#050505] border border-[#222222] text-white rounded-md px-4 py-2 focus:border-[#EA580C]" />
                </div>
                <div>
                  <label className="block text-sm text-[#9CA3AF] mb-2">Role</label>
                  <input {...registerEdit('role')} required className="w-full bg-[#050505] border border-[#222222] text-white rounded-md px-4 py-2 focus:border-[#EA580C]" />
                </div>
                <div>
                  <label className="block text-sm text-[#9CA3AF] mb-2">Start Date</label>
                  <input {...registerEdit('startDate')} required type="date" className="w-full bg-[#050505] border border-[#222222] text-white rounded-md px-4 py-2 focus:border-[#EA580C]" />
                </div>
                <div>
                  <label className="block text-sm text-[#9CA3AF] mb-2">End Date</label>
                  <input {...registerEdit('endDate')} type="date" className="w-full bg-[#050505] border border-[#222222] text-white rounded-md px-4 py-2 focus:border-[#EA580C]" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-[#9CA3AF] mb-2">Achievements (One per line)</label>
                <textarea {...registerEdit('achievements')} required rows={4} className="w-full bg-[#050505] border border-[#222222] text-white rounded-md px-4 py-2 focus:border-[#EA580C]" />
              </div>

              <div className="pt-4 border-t border-[#222222]">
                <h4 className="text-lg font-medium text-white mb-4">Work Breakdown</h4>
                <WorkTreeEditor nodes={editWorkTree} onChange={setEditWorkTree} />
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="submit"
                  className="bg-[#EA580C] hover:bg-[#F97316] text-white px-6 py-2 rounded-md font-medium"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
