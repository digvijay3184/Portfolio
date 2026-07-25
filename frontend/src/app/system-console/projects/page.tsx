'use client';

import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useContent } from '@/lib/hooks/useContent';
import { useMediaUpload, useMediaDelete } from '@/lib/hooks/useMedia';
import { Trash2, Edit2, X } from 'lucide-react';
import JsonImporter from '@/components/admin/JsonImporter';
import { projectSchema } from '@/lib/validations/jsonSchemas';
import toast from 'react-hot-toast';

const projectExampleTemplate = `{
  "title": "My Awesome Project",
  "summary": "A full-stack web application built with Next.js",
  "techStack": ["Next.js", "React", "TypeScript", "Tailwind"],
  "liveUrl": "https://example.com",
  "repoUrl": "https://github.com/example/repo"
}`;

export default function ProjectsAdminPage() {
  const { data: projects, isLoading, create, remove, update } = useContent('project');
  const uploadMedia = useMediaUpload();
  const deleteMedia = useMediaDelete();
  const { register, handleSubmit, setValue, reset } = useForm();
  const [coverPreview, setCoverPreview] = useState<string | null>(null);

  const [editingProj, setEditingProj] = useState<any>(null);
  const [editCoverPreview, setEditCoverPreview] = useState<string | null>(null);
  const { register: registerEdit, handleSubmit: handleSubmitEdit, setValue: setValueEdit, reset: resetEdit } = useForm();

  const handleJsonImport = (validatedData: any) => {
    reset({
      ...validatedData,
      techStack: Array.isArray(validatedData.techStack) 
        ? validatedData.techStack.join(', ') 
        : validatedData.techStack
    });
    if (validatedData.coverImageUrl) {
      setCoverPreview(validatedData.coverImageUrl);
    }
    toast.success('JSON imported successfully');
  };

  const [isUploading, setIsUploading] = useState(false);
  const [galleryItems, setGalleryItems] = useState<{url: string, publicId: string, caption: string}[]>([]);
  const [editGalleryItems, setEditGalleryItems] = useState<{url: string, publicId: string, caption: string}[]>([]);

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverPreview(URL.createObjectURL(file));

    const toastId = toast.loading('Uploading cover image...');
    setIsUploading(true);
    try {
      const { url, publicId } = await uploadMedia.mutateAsync(file);
      setValue('coverImageUrl', url, { shouldDirty: true });
      setValue('coverImagePublicId', publicId, { shouldDirty: true });
      toast.success('Cover image uploaded!', { id: toastId });
    } catch (err) {
      toast.error('Failed to upload image', { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };

  const onEditFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setEditCoverPreview(URL.createObjectURL(file));

    const toastId = toast.loading('Uploading new cover image...');
    setIsUploading(true);
    try {
      const { url, publicId } = await uploadMedia.mutateAsync(file);
      setValueEdit('coverImageUrl', url, { shouldDirty: true });
      setValueEdit('coverImagePublicId', publicId, { shouldDirty: true });
      toast.success('New cover image uploaded!', { id: toastId });
    } catch (err) {
      toast.error('Failed to upload image', { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };

  const onGalleryChange = async (e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean = false) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const toastId = toast.loading(`Uploading ${files.length} gallery image(s)...`);
    setIsUploading(true);
    try {
      const uploaded: Array<{ url: string; publicId: string; caption: string }> = [];
      for (let i = 0; i < files.length; i++) {
        const { url, publicId } = await uploadMedia.mutateAsync(files[i]);
        uploaded.push({ url, publicId, caption: '' });
      }
      if (isEdit) {
        setEditGalleryItems((prev) => [...prev, ...uploaded]);
      } else {
        setGalleryItems((prev) => [...prev, ...uploaded]);
      }
      toast.success('Gallery images uploaded!', { id: toastId });
    } catch (err) {
      toast.error('Failed to upload gallery images', { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };

  const removeGalleryItem = (index: number, isEdit: boolean = false) => {
    if (isEdit) {
      setEditGalleryItems(prev => prev.filter((_, i) => i !== index));
    } else {
      setGalleryItems(prev => prev.filter((_, i) => i !== index));
    }
  };

  const onSubmit = async (payload: any) => {
    try {
      const formattedPayload = {
        ...payload,
        status: payload.isPublished ? 'published' : 'draft',
        slug: payload.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
        techStack: payload.techStack.split(',').map((t: string) => t.trim()).filter(Boolean),
        gallery: galleryItems,
      };
      delete formattedPayload.isPublished;
      
      await create(formattedPayload);
      reset();
      setCoverPreview(null);
      setGalleryItems([]);
      toast.success('Project added!');
    } catch (err) {
      toast.error('Failed to add project');
    }
  };

  const openEditModal = (proj: any) => {
    setEditingProj(proj);
    setEditCoverPreview(proj.coverImageUrl || null);
    setEditGalleryItems(proj.gallery || []);
    resetEdit({
      title: proj.title,
      summary: proj.summary,
      techStack: proj.techStack?.join(', ') || '',
      liveUrl: proj.liveUrl,
      repoUrl: proj.repoUrl,
      isPublished: proj.status === 'published',
      coverImageUrl: proj.coverImageUrl,
      coverImagePublicId: proj.coverImagePublicId,
    });
  };

  const onEditSubmit = async (payload: any) => {
    try {
      const formattedPayload = {
        ...payload,
        status: payload.isPublished ? 'published' : 'draft',
        slug: payload.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
        techStack: payload.techStack.split(',').map((t: string) => t.trim()).filter(Boolean),
        gallery: editGalleryItems,
      };
      delete formattedPayload.isPublished;

      if (!payload.coverImageUrl) {
        formattedPayload.coverImageUrl = editingProj.coverImageUrl;
        formattedPayload.coverImagePublicId = editingProj.coverImagePublicId;
      } else if (editingProj.coverImagePublicId && payload.coverImagePublicId !== editingProj.coverImagePublicId) {
        await deleteMedia.mutateAsync(editingProj.coverImagePublicId);
      }

      const removedGalleryItems = editingProj.gallery?.filter(
        (oldItem: any) => !formattedPayload.gallery.some((newItem: any) => newItem.publicId === oldItem.publicId)
      ) || [];
      
      for (const item of removedGalleryItems) {
        if (item.publicId) {
          try { await deleteMedia.mutateAsync(item.publicId); } catch(e) {}
        }
      }

      await update({ id: editingProj._id, data: formattedPayload });
      setEditingProj(null);
      toast.success('Project updated!');
    } catch (err) {
      toast.error('Failed to update project');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await remove(id);
      toast.success('Project deleted');
    } catch (err) {
      toast.error('Failed to delete project');
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Manage Projects</h2>
        <JsonImporter schema={projectSchema} onValidData={handleJsonImport} label="Import Project JSON" exampleTemplate={projectExampleTemplate} />
      </div>
      
      <div className="bg-[#121212] border border-[#222222] p-6 rounded-xl">
        <h3 className="text-lg font-medium text-white mb-4">Add New Project</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-[#9CA3AF] mb-2">Title</label>
              <input {...register('title')} required className="w-full bg-[#050505] border border-[#222222] text-white rounded-md px-4 py-2 focus:border-[#EA580C]" />
            </div>
            <div>
              <label className="block text-sm text-[#9CA3AF] mb-2">Technologies (comma separated)</label>
              <input {...register('techStack')} required placeholder="React, NestJS, MongoDB" className="w-full bg-[#050505] border border-[#222222] text-white rounded-md px-4 py-2 focus:border-[#EA580C]" />
            </div>
            <div>
              <label className="block text-sm text-[#9CA3AF] mb-2">Live URL</label>
              <input {...register('liveUrl')} className="w-full bg-[#050505] border border-[#222222] text-white rounded-md px-4 py-2 focus:border-[#EA580C]" />
            </div>
            <div>
              <label className="block text-sm text-[#9CA3AF] mb-2">GitHub URL</label>
              <input {...register('repoUrl')} className="w-full bg-[#050505] border border-[#222222] text-white rounded-md px-4 py-2 focus:border-[#EA580C]" />
            </div>
          </div>
          <div>
            <label className="block text-sm text-[#9CA3AF] mb-2">Summary</label>
            <textarea {...register('summary')} required rows={3} className="w-full bg-[#050505] border border-[#222222] text-white rounded-md px-4 py-2 focus:border-[#EA580C]" />
          </div>
          <div>
            <label className="block text-sm text-[#9CA3AF] mb-2">Publish Status</label>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" {...register('isPublished')} className="sr-only peer" />
              <div className="w-11 h-6 bg-[#222222] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#EA580C]"></div>
              <span className="ml-3 text-sm font-medium text-white">Published to Portfolio</span>
            </label>
          </div>
          <div>
            <label className="block text-sm text-[#9CA3AF] mb-2">Cover Image</label>
            <div className="flex items-center gap-4">
              {coverPreview && (
                <img src={coverPreview} alt="Preview" className="h-24 w-40 object-cover rounded-xl border border-[#222222]" />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={onFileChange}
                required
                className="text-[#9CA3AF] file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#222222] file:text-white hover:file:bg-[#333333] cursor-pointer"
              />
            </div>
            <input type="hidden" {...register('coverImageUrl')} />
            <input type="hidden" {...register('coverImagePublicId')} />
          </div>

          <div>
            <label className="block text-sm text-[#9CA3AF] mb-2">Gallery Images (Optional - Multi-select)</label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => onGalleryChange(e, false)}
              className="text-[#9CA3AF] file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#222222] file:text-white hover:file:bg-[#333333] cursor-pointer mb-4"
            />
            {galleryItems.length > 0 && (
              <div className="flex flex-wrap gap-4 mt-4">
                {galleryItems.map((item, idx) => (
                  <div key={idx} className="relative group">
                    <img src={item.url} alt="gallery" className="h-20 w-32 object-cover rounded-lg border border-[#222222]" />
                    <button
                      type="button"
                      onClick={() => removeGalleryItem(idx, false)}
                      className="absolute top-1 right-1 bg-black/70 p-1 rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          <button type="submit" disabled={isUploading} className="bg-[#EA580C] hover:bg-[#F97316] disabled:opacity-50 disabled:cursor-not-allowed text-white px-6 py-2 rounded-md">
            {isUploading ? 'Uploading Image...' : 'Add Project'}
          </button>
        </form>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium text-white">Existing Projects</h3>
        {projects?.map((proj: any) => (
          <div key={proj._id} className="bg-[#121212] border border-[#222222] p-4 rounded-xl flex justify-between items-center">
            <div className="flex items-center gap-4">
              {proj.coverImageUrl ? (
                <img src={proj.coverImageUrl} alt={proj.title} className="w-16 h-10 object-cover rounded-md" />
              ) : (
                <div className="w-16 h-10 bg-[#222222] rounded-md flex items-center justify-center border border-[#333333]">
                  <span className="text-[10px] text-[#9CA3AF]">No Img</span>
                </div>
              )}
              <div>
                <h4 className="font-bold text-white">{proj.title}</h4>
                <p className="text-sm text-[#9CA3AF]">{proj.techStack?.join(', ')}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => openEditModal(proj)} className="text-[#EA580C] hover:text-[#F97316] p-2">
                <Edit2 size={18} />
              </button>
              <button onClick={() => handleDelete(proj._id)} className="text-red-500 hover:text-red-400 p-2">
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
        {projects?.length === 0 && <p className="text-[#9CA3AF]">No projects added yet.</p>}
      </div>

      {editingProj && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#121212] border border-[#333333] p-6 rounded-xl w-full max-w-2xl relative shadow-2xl h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-white text-lg font-semibold flex items-center gap-2">
                <Edit2 size={20} className="text-[#EA580C]" />
                Edit Project
              </h3>
              <button 
                type="button"
                onClick={() => setEditingProj(null)}
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
                  <label className="block text-sm text-[#9CA3AF] mb-2">Technologies (comma separated)</label>
                  <input {...registerEdit('techStack')} required placeholder="React, NestJS, MongoDB" className="w-full bg-[#050505] border border-[#222222] text-white rounded-md px-4 py-2 focus:border-[#EA580C]" />
                </div>
                <div>
                  <label className="block text-sm text-[#9CA3AF] mb-2">Live URL</label>
                  <input {...registerEdit('liveUrl')} className="w-full bg-[#050505] border border-[#222222] text-white rounded-md px-4 py-2 focus:border-[#EA580C]" />
                </div>
                <div>
                  <label className="block text-sm text-[#9CA3AF] mb-2">GitHub URL</label>
                  <input {...registerEdit('repoUrl')} className="w-full bg-[#050505] border border-[#222222] text-white rounded-md px-4 py-2 focus:border-[#EA580C]" />
                </div>
              </div>
              <div>
                <label className="block text-sm text-[#9CA3AF] mb-2">Summary</label>
                <textarea {...registerEdit('summary')} required rows={3} className="w-full bg-[#050505] border border-[#222222] text-white rounded-md px-4 py-2 focus:border-[#EA580C]" />
              </div>
              <div>
                <label className="block text-sm text-[#9CA3AF] mb-2">Publish Status</label>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" {...registerEdit('isPublished')} className="sr-only peer" />
                  <div className="w-11 h-6 bg-[#222222] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#EA580C]"></div>
                  <span className="ml-3 text-sm font-medium text-white">Published to Portfolio</span>
                </label>
              </div>
              <div>
                <label className="block text-sm text-[#9CA3AF] mb-2">Cover Image (Upload new to replace)</label>
                <div className="flex items-center gap-4">
                  {editCoverPreview && (
                    <img src={editCoverPreview} alt="Preview" className="h-24 w-40 object-cover rounded-xl border border-[#222222]" />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={onEditFileChange}
                    className="text-[#9CA3AF] file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#222222] file:text-white hover:file:bg-[#333333] cursor-pointer"
                  />
                </div>
                <input type="hidden" {...registerEdit('coverImageUrl')} />
                <input type="hidden" {...registerEdit('coverImagePublicId')} />
              </div>
              <div>
                <label className="block text-sm text-[#9CA3AF] mb-2">Gallery Images (Optional - Multi-select)</label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => onGalleryChange(e, true)}
                  className="text-[#9CA3AF] file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#222222] file:text-white hover:file:bg-[#333333] cursor-pointer mb-4"
                />
                {editGalleryItems.length > 0 && (
                  <div className="flex flex-wrap gap-4 mt-4">
                    {editGalleryItems.map((item, idx) => (
                      <div key={idx} className="relative group">
                        <img src={item.url} alt="gallery" className="h-20 w-32 object-cover rounded-lg border border-[#222222]" />
                        <button
                          type="button"
                          onClick={() => removeGalleryItem(idx, true)}
                          className="absolute top-1 right-1 bg-black/70 p-1 rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
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
