'use client';

import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useContent } from '@/lib/hooks/useContent';
import { Trash2, Edit2, X } from 'lucide-react';
import JsonImporter from '@/components/admin/JsonImporter';
import { mindsetSchema } from '@/lib/validations/jsonSchemas';
import toast from 'react-hot-toast';

const mindsetExampleTemplate = `{
  "title": "Build for Scale",
  "description": "Always design architectures that can scale horizontally without breaking.",
  "icon": "Server",
  "order": 1
}`;

export default function MindsetAdminPage() {
  const { data: mindsets, isLoading, create, remove, update } = useContent('mindset');
  const { register, handleSubmit, reset } = useForm();
  
  const [editingMindset, setEditingMindset] = useState<any>(null);
  const { register: registerEdit, handleSubmit: handleSubmitEdit, reset: resetEdit } = useForm();

  const handleJsonImport = (validatedData: any) => {
    reset(validatedData);
    toast.success('JSON imported successfully');
  };
  
  const onSubmit = async (payload: any) => {
    try {
      await create({
        ...payload,
        order: parseInt(payload.order, 10) || 0
      });
      reset();
      toast.success('Principle added!');
    } catch (err) {
      toast.error('Failed to add principle');
    }
  };

  const openEditModal = (mindset: any) => {
    setEditingMindset(mindset);
    resetEdit({
      title: mindset.title,
      description: mindset.description,
      icon: mindset.icon,
      order: mindset.order
    });
  };

  const onEditSubmit = async (payload: any) => {
    try {
      await update({ 
        id: editingMindset._id, 
        data: {
          ...payload,
          order: parseInt(payload.order, 10) || 0
        } 
      });
      setEditingMindset(null);
      toast.success('Principle updated!');
    } catch (err) {
      toast.error('Failed to update principle');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await remove(id);
      toast.success('Principle deleted');
    } catch (err) {
      toast.error('Failed to delete principle');
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Manage Engineering Mindset</h2>
        <JsonImporter schema={mindsetSchema} onValidData={handleJsonImport} label="Import JSON" exampleTemplate={mindsetExampleTemplate} />
      </div>
      
      <div className="bg-[#121212] border border-[#222222] p-6 rounded-xl">
        <h3 className="text-lg font-medium text-white mb-4">Add New Principle</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-[#9CA3AF] mb-2">Title</label>
              <input {...register('title')} required className="w-full bg-[#050505] border border-[#222222] text-white rounded-md px-4 py-2 focus:border-[#EA580C]" />
            </div>
            <div>
              <label className="block text-sm text-[#9CA3AF] mb-2">Icon Name (lucide-react)</label>
              <input {...register('icon')} placeholder="e.g. Server, Code, Zap" className="w-full bg-[#050505] border border-[#222222] text-white rounded-md px-4 py-2 focus:border-[#EA580C]" />
            </div>
            <div>
              <label className="block text-sm text-[#9CA3AF] mb-2">Order</label>
              <input {...register('order')} type="number" defaultValue={0} className="w-full bg-[#050505] border border-[#222222] text-white rounded-md px-4 py-2 focus:border-[#EA580C]" />
            </div>
          </div>
          <div>
            <label className="block text-sm text-[#9CA3AF] mb-2">Description</label>
            <textarea {...register('description')} required rows={3} className="w-full bg-[#050505] border border-[#222222] text-white rounded-md px-4 py-2 focus:border-[#EA580C]" />
          </div>
          <button type="submit" className="bg-[#EA580C] hover:bg-[#F97316] text-white px-6 py-2 rounded-md">
            Add Principle
          </button>
        </form>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white">Existing Principles</h3>
        {mindsets?.sort((a: any, b: any) => a.order - b.order).map((mindset: any) => (
          <div key={mindset._id} className="bg-[#121212] border border-[#222222] p-4 rounded-xl flex justify-between items-start">
            <div>
              <h4 className="font-bold text-white flex items-center gap-2">
                <span className="text-[#9CA3AF] text-sm">#{mindset.order}</span>
                {mindset.title}
              </h4>
              <p className="text-sm text-[#9CA3AF] mt-1">{mindset.description}</p>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => openEditModal(mindset)} className="text-[#EA580C] hover:text-[#F97316] p-2">
                <Edit2 size={18} />
              </button>
              <button onClick={() => handleDelete(mindset._id)} className="text-red-500 hover:text-red-400 p-2">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
        {mindsets?.length === 0 && <p className="text-[#9CA3AF]">No principles added yet.</p>}
      </div>

      {editingMindset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#121212] border border-[#333333] p-6 rounded-xl w-full max-w-2xl relative shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-white text-lg font-semibold flex items-center gap-2">
                <Edit2 size={20} className="text-[#EA580C]" />
                Edit Principle
              </h3>
              <button 
                type="button"
                onClick={() => setEditingMindset(null)}
                className="text-[#9CA3AF] hover:text-white p-1 rounded-md"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmitEdit(onEditSubmit)} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm text-[#9CA3AF] mb-2">Title</label>
                  <input {...registerEdit('title')} required className="w-full bg-[#050505] border border-[#222222] text-white rounded-md px-4 py-2 focus:border-[#EA580C]" />
                </div>
                <div>
                  <label className="block text-sm text-[#9CA3AF] mb-2">Icon Name</label>
                  <input {...registerEdit('icon')} className="w-full bg-[#050505] border border-[#222222] text-white rounded-md px-4 py-2 focus:border-[#EA580C]" />
                </div>
                <div>
                  <label className="block text-sm text-[#9CA3AF] mb-2">Order</label>
                  <input {...registerEdit('order')} type="number" className="w-full bg-[#050505] border border-[#222222] text-white rounded-md px-4 py-2 focus:border-[#EA580C]" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-[#9CA3AF] mb-2">Description</label>
                <textarea {...registerEdit('description')} required rows={3} className="w-full bg-[#050505] border border-[#222222] text-white rounded-md px-4 py-2 focus:border-[#EA580C]" />
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
