'use client';

import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useContent } from '@/lib/hooks/useContent';
import { useMediaUpload, useMediaDelete } from '@/lib/hooks/useMedia';
import JsonImporter from '@/components/admin/JsonImporter';
import { heroSchema } from '@/lib/validations/jsonSchemas';
import toast from 'react-hot-toast';

const heroExampleTemplate = `{
  "name": "Jane Doe",
  "roles": ["Software Engineer", "Designer"],
  "accentColor": "#EA580C",
  "ctaLabel": "Contact Me",
}`;

export default function HeroAdminPage() {
  const { data, isLoading, create, update } = useContent('hero');
  const uploadMedia = useMediaUpload();
  const deleteMedia = useMediaDelete();
  const { register, handleSubmit, setValue, watch, reset } = useForm();
  
  const heroDoc = data?.[0];
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  useEffect(() => {
    if (heroDoc) {
      reset({
        name: heroDoc.name,
        roles: heroDoc.roles?.join(', ') || '',
        accentColor: heroDoc.accentColor,
        ctaLabel: heroDoc.ctaLabel,
        cvUrl: heroDoc.cvUrl,
        cvPublicId: heroDoc.cvPublicId,
        avatarUrl: heroDoc.avatarUrl,
        avatarPublicId: heroDoc.avatarPublicId,
      });
      setAvatarPreview(heroDoc.avatarUrl);
    }
  }, [heroDoc, reset]);

  const handleJsonImport = (validatedData: any) => {
    reset({
      ...validatedData,
      roles: Array.isArray(validatedData.roles) ? validatedData.roles.join(', ') : validatedData.roles,
    });
    if (validatedData.avatarUrl) {
      setAvatarPreview(validatedData.avatarUrl);
    }
    toast.success('JSON imported successfully');
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setAvatarPreview(URL.createObjectURL(file));

    try {
      const { url, publicId } = await uploadMedia.mutateAsync(file);
      setValue('avatarUrl', url, { shouldDirty: true });
      setValue('avatarPublicId', publicId, { shouldDirty: true });
    } catch (err) {
      toast.error('Failed to upload image');
    }
  };

  const onCVFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const toastId = toast.loading('Uploading CV...');
    try {
      const { url, publicId } = await uploadMedia.mutateAsync(file);
      setValue('cvUrl', url, { shouldDirty: true });
      setValue('cvPublicId', publicId, { shouldDirty: true });
      toast.success('CV uploaded successfully!', { id: toastId });
    } catch (err) {
      toast.error('Failed to upload CV', { id: toastId });
    }
  };

  const onSubmit = async (formData: any) => {
    try {
      const payload = {
        ...formData,
        roles: formData.roles.split(',').map((r: string) => r.trim()).filter(Boolean),
      };

      if (heroDoc) {
        if (!payload.avatarUrl) {
          payload.avatarUrl = heroDoc.avatarUrl;
          payload.avatarPublicId = heroDoc.avatarPublicId;
        } else if (heroDoc.avatarPublicId && payload.avatarPublicId !== heroDoc.avatarPublicId) {
          await deleteMedia.mutateAsync(heroDoc.avatarPublicId);
        }

        if (!payload.cvUrl) {
          payload.cvUrl = heroDoc.cvUrl;
          payload.cvPublicId = heroDoc.cvPublicId;
        } else if (heroDoc.cvPublicId && payload.cvPublicId !== heroDoc.cvPublicId) {
          await deleteMedia.mutateAsync(heroDoc.cvPublicId);
        }

        await update({ id: heroDoc._id, data: payload });
      } else {
        await create(payload);
      }
      toast.success('Hero section saved!');
    } catch (err) {
      toast.error('Failed to save Hero section');
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Manage Hero Section</h2>
        <JsonImporter schema={heroSchema} onValidData={handleJsonImport} label="Import Hero JSON" exampleTemplate={heroExampleTemplate} />
      </div>
      
      <div className="bg-[#121212] border border-[#222222] p-6 rounded-xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-2 gap-6">
            <div>
              <label className="block text-sm text-[#9CA3AF] mb-2">Name</label>
              <input
                {...register('name')}
                required
                className="w-full bg-[#050505] border border-[#222222] text-white rounded-md px-4 py-2 focus:outline-none focus:border-[#EA580C]"
              />
            </div>
            <div>
              <label className="block text-sm text-[#9CA3AF] mb-2">Roles (comma separated)</label>
              <input
                {...register('roles')}
                required
                className="w-full bg-[#050505] border border-[#222222] text-white rounded-md px-4 py-2 focus:outline-none focus:border-[#EA580C]"
                placeholder="Software Engineer, Designer"
              />
            </div>
            <div>
              <label className="block text-sm text-[#9CA3AF] mb-2">Accent Color</label>
              <input
                {...register('accentColor')}
                type="color"
                className="w-full h-10 bg-[#050505] border border-[#222222] rounded-md cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-sm text-[#9CA3AF] mb-2">CTA Label</label>
              <input
                {...register('ctaLabel')}
                className="w-full bg-[#050505] border border-[#222222] text-white rounded-md px-4 py-2 focus:outline-none focus:border-[#EA580C]"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm text-[#9CA3AF] mb-2">Avatar Image (2D Anime Style)</label>
            <div className="flex items-center gap-4">
              {avatarPreview && (
                <img src={avatarPreview} alt="Preview" className="w-24 h-24 object-cover rounded-full border-2 border-[#222222]" />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={onFileChange}
                className="text-[#9CA3AF] file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#222222] file:text-white hover:file:bg-[#333333] cursor-pointer"
              />
            </div>
            <input type="hidden" {...register('avatarUrl')} />
            <input type="hidden" {...register('avatarPublicId')} />
          </div>

          <button
            type="submit"
            className="bg-[#EA580C] hover:bg-[#F97316] text-white px-6 py-2 rounded-md transition-colors"
          >
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
