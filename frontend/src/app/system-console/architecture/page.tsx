'use client';

import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useContent } from '@/lib/hooks/useContent';
import { useMediaUpload, useMediaDelete } from '@/lib/hooks/useMedia';
import { Trash2, Edit2, X } from 'lucide-react';
import JsonImporter from '@/components/admin/JsonImporter';
import { architectureSchema } from '@/lib/validations/jsonSchemas';
import toast from 'react-hot-toast';

const architectureExampleTemplate = `{
  "title": "System Architecture Overview",
  "description": "High level block diagram of the microservices.",
  "diagramUrl": "https://example.com/diagram.png",
  "order": 1
}`;

export default function ArchitectureAdminPage() {
  const { data: architectures, isLoading, create, remove, update } = useContent('architecture');
  const uploadMedia = useMediaUpload();
  const deleteMedia = useMediaDelete();
  const { register, handleSubmit, setValue, reset } = useForm();
  const [diagramPreview, setDiagramPreview] = useState<string | null>(null);

  const [editingArch, setEditingArch] = useState<any>(null);
  const [editDiagramPreview, setEditDiagramPreview] = useState<string | null>(null);
  const { register: registerEdit, handleSubmit: handleSubmitEdit, setValue: setValueEdit, reset: resetEdit } = useForm();

  const [isUploading, setIsUploading] = useState(false);

  const handleJsonImport = (validatedData: any) => {
    reset(validatedData);
    if (validatedData.diagramUrl) {
      setDiagramPreview(validatedData.diagramUrl);
    }
    toast.success('JSON imported successfully');
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setDiagramPreview(URL.createObjectURL(file));

    const toastId = toast.loading('Uploading diagram...');
    setIsUploading(true);
    try {
      const { url, publicId } = await uploadMedia.mutateAsync(file);
      setValue('diagramUrl', url, { shouldDirty: true });
      setValue('diagramPublicId', publicId, { shouldDirty: true });
      toast.success('Diagram uploaded!', { id: toastId });
    } catch (err) {
      toast.error('Failed to upload diagram', { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };

  const onEditFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setEditDiagramPreview(URL.createObjectURL(file));

    const toastId = toast.loading('Uploading new diagram...');
    setIsUploading(true);
    try {
      const { url, publicId } = await uploadMedia.mutateAsync(file);
      setValueEdit('diagramUrl', url, { shouldDirty: true });
      setValueEdit('diagramPublicId', publicId, { shouldDirty: true });
      toast.success('New diagram uploaded!', { id: toastId });
    } catch (err) {
      toast.error('Failed to upload diagram', { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };

  const onSubmit = async (payload: any) => {
    try {
      await create({
        ...payload,
        order: parseInt(payload.order, 10) || 0
      });
      reset();
      setDiagramPreview(null);
      toast.success('Architecture doc added!');
    } catch (err) {
      toast.error('Failed to add architecture doc');
    }
  };

  const openEditModal = (arch: any) => {
    setEditingArch(arch);
    setEditDiagramPreview(arch.diagramUrl || null);
    resetEdit({
      title: arch.title,
      description: arch.description,
      diagramUrl: arch.diagramUrl,
      diagramPublicId: arch.diagramPublicId,
      order: arch.order
    });
  };

  const onEditSubmit = async (payload: any) => {
    try {
      const formattedPayload = {
        ...payload,
        order: parseInt(payload.order, 10) || 0
      };

      if (!payload.diagramUrl) {
        formattedPayload.diagramUrl = editingArch.diagramUrl;
        formattedPayload.diagramPublicId = editingArch.diagramPublicId;
      } else if (editingArch.diagramPublicId && payload.diagramPublicId !== editingArch.diagramPublicId) {
        // Delete old diagram from cloudinary if a new one was uploaded
        await deleteMedia.mutateAsync(editingArch.diagramPublicId);
      }

      await update({ id: editingArch._id, data: formattedPayload });
      setEditingArch(null);
      toast.success('Architecture doc updated!');
    } catch (err) {
      toast.error('Failed to update architecture doc');
    }
  };

  const handleDelete = async (arch: any) => {
    try {
      if (arch.diagramPublicId) {
        await deleteMedia.mutateAsync(arch.diagramPublicId);
      }
      await remove(arch._id);
      toast.success('Architecture doc deleted');
    } catch (err) {
      toast.error('Failed to delete architecture doc');
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Manage Architecture Docs</h2>
        <JsonImporter schema={architectureSchema} onValidData={handleJsonImport} label="Import JSON" exampleTemplate={architectureExampleTemplate} />
      </div>
      
      <div className="bg-[#121212] border border-[#222222] p-6 rounded-xl">
        <h3 className="text-lg font-medium text-white mb-4">Add New Architecture Doc</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-[#9CA3AF] mb-2">Title</label>
              <input {...register('title')} required className="w-full bg-[#050505] border border-[#222222] text-white rounded-md px-4 py-2 focus:border-[#EA580C]" />
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
          <div>
            <label className="block text-sm text-[#9CA3AF] mb-2">Diagram Image</label>
            <div className="flex items-center gap-4">
              {diagramPreview && (
                <img src={diagramPreview} alt="Preview" className="h-24 w-40 object-cover rounded-xl border border-[#222222]" />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={onFileChange}
                required
                className="text-[#9CA3AF] file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#222222] file:text-white hover:file:bg-[#333333] cursor-pointer"
              />
            </div>
            <input type="hidden" {...register('diagramUrl')} />
            <input type="hidden" {...register('diagramPublicId')} />
          </div>
          <button type="submit" disabled={isUploading} className="bg-[#EA580C] hover:bg-[#F97316] disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-md">
            {isUploading ? 'Uploading Image...' : 'Add Architecture Doc'}
          </button>
        </form>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white">Existing Architecture Docs</h3>
        {architectures?.sort((a: any, b: any) => a.order - b.order).map((arch: any) => (
          <div key={arch._id} className="bg-[#121212] border border-[#222222] p-4 rounded-xl flex justify-between items-center">
            <div className="flex items-center gap-4">
              {arch.diagramUrl ? (
                <img src={arch.diagramUrl} alt={arch.title} className="w-16 h-10 object-cover rounded-md" />
              ) : (
                <div className="w-16 h-10 bg-[#222222] rounded-md flex items-center justify-center border border-[#333333]">
                  <span className="text-[10px] text-[#9CA3AF]">No Img</span>
                </div>
              )}
              <div>
                <h4 className="font-bold text-white flex items-center gap-2">
                  <span className="text-[#9CA3AF] text-sm">#{arch.order}</span>
                  {arch.title}
                </h4>
                <p className="text-sm text-[#9CA3AF] mt-1">{arch.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => openEditModal(arch)} className="text-[#EA580C] hover:text-[#F97316] p-2">
                <Edit2 size={18} />
              </button>
              <button onClick={() => handleDelete(arch)} className="text-red-500 hover:text-red-400 p-2">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
        {architectures?.length === 0 && <p className="text-[#9CA3AF]">No architecture docs added yet.</p>}
      </div>

      {editingArch && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#121212] border border-[#333333] p-6 rounded-xl w-full max-w-2xl relative shadow-2xl overflow-y-auto max-h-[90vh]">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-white text-lg font-semibold flex items-center gap-2">
                <Edit2 size={20} className="text-[#EA580C]" />
                Edit Architecture Doc
              </h3>
              <button 
                type="button"
                onClick={() => setEditingArch(null)}
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
                  <label className="block text-sm text-[#9CA3AF] mb-2">Order</label>
                  <input {...registerEdit('order')} type="number" className="w-full bg-[#050505] border border-[#222222] text-white rounded-md px-4 py-2 focus:border-[#EA580C]" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-[#9CA3AF] mb-2">Description</label>
                <textarea {...registerEdit('description')} required rows={3} className="w-full bg-[#050505] border border-[#222222] text-white rounded-md px-4 py-2 focus:border-[#EA580C]" />
              </div>
              <div>
                <label className="block text-sm text-[#9CA3AF] mb-2">Diagram Image (Upload new to replace)</label>
                <div className="flex items-center gap-4">
                  {editDiagramPreview && (
                    <img src={editDiagramPreview} alt="Preview" className="h-24 w-40 object-cover rounded-xl border border-[#222222]" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={onEditFileChange}
                    className="text-[#9CA3AF] file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#222222] file:text-white hover:file:bg-[#333333] cursor-pointer"
                  />
                </div>
                <input type="hidden" {...registerEdit('diagramUrl')} />
                <input type="hidden" {...registerEdit('diagramPublicId')} />
              </div>
              <div className="flex justify-end gap-4 mt-6">
                <button
                  type="submit"
                  disabled={isUploading}
                  className="bg-[#EA580C] hover:bg-[#F97316] disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-md font-medium"
                >
                  {isUploading ? 'Uploading Image...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
