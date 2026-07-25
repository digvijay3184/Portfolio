'use client';

import { useForm } from 'react-hook-form';
import { useEffect, useState } from 'react';
import { useContent } from '@/lib/hooks/useContent';
import { useMediaUpload, useMediaDelete } from '@/lib/hooks/useMedia';
import JsonImporter from '@/components/admin/JsonImporter';
import { aboutSchema } from '@/lib/validations/jsonSchemas';
import toast from 'react-hot-toast';

const aboutExampleTemplate = `{
  "heading": "About Me",
  "bio": "I am a passionate developer with a knack for building scalable web applications.\\n\\nI love open source and design."
}`;

export default function AboutAdminPage() {
  const { data, isLoading, create, update } = useContent('about');
  const uploadMedia = useMediaUpload();
  const deleteMedia = useMediaDelete();
  const { register, handleSubmit, setValue, reset } = useForm();
  
  const aboutDoc = data?.[0];
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (aboutDoc) {
      reset({
        heading: aboutDoc.heading,
        bio: aboutDoc.bio,
        imageUrl: aboutDoc.imageUrl,
        imagePublicId: aboutDoc.imagePublicId,
      });
      setImagePreview(aboutDoc.imageUrl);
    }
  }, [aboutDoc, reset]);

  const handleJsonImport = (validatedData: any) => {
    reset(validatedData);
    if (validatedData.imageUrl) {
      setImagePreview(validatedData.imageUrl);
    }
    toast.success('JSON imported successfully');
  };

  const onFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImagePreview(URL.createObjectURL(file));

    try {
      const { url, publicId } = await uploadMedia.mutateAsync(file);
      setValue('imageUrl', url, { shouldDirty: true });
      setValue('imagePublicId', publicId, { shouldDirty: true });
    } catch (err) {
      toast.error('Failed to upload image');
    }
  };

  const onSubmit = async (payload: any) => {
    try {
      if (aboutDoc) {
        if (!payload.imageUrl) {
          payload.imageUrl = aboutDoc.imageUrl;
          payload.imagePublicId = aboutDoc.imagePublicId;
        } else if (aboutDoc.imagePublicId && payload.imagePublicId !== aboutDoc.imagePublicId) {
          await deleteMedia.mutateAsync(aboutDoc.imagePublicId);
        }
        await update({ id: aboutDoc._id, data: payload });
      } else {
        await create(payload);
      }
      toast.success('About section saved!');
    } catch (err) {
      toast.error('Failed to save About section');
    }
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Manage About Section</h2>
        <JsonImporter schema={aboutSchema} onValidData={handleJsonImport} label="Import About JSON" exampleTemplate={aboutExampleTemplate} />
      </div>
      <div className="bg-[#121212] border border-[#222222] p-6 rounded-xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm text-[#9CA3AF] mb-2">Heading</label>
            <input
              {...register('heading')}
              required
              className="w-full bg-[#050505] border border-[#222222] text-white rounded-md px-4 py-2 focus:outline-none focus:border-[#EA580C]"
            />
          </div>
          <div>
            <label className="block text-sm text-[#9CA3AF] mb-2">Bio (Markdown supported)</label>
            <textarea
              {...register('bio')}
              required
              rows={6}
              className="w-full bg-[#050505] border border-[#222222] text-white rounded-md px-4 py-2 focus:outline-none focus:border-[#EA580C]"
            />
          </div>
          
          <div>
            <label className="block text-sm text-[#9CA3AF] mb-2">About Image</label>
            <div className="flex items-center gap-4">
              {imagePreview && (
                <img src={imagePreview} alt="Preview" className="w-32 h-32 object-cover rounded-xl border border-[#222222]" />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={onFileChange}
                className="text-[#9CA3AF] file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-[#222222] file:text-white hover:file:bg-[#333333] cursor-pointer"
              />
            </div>
            <input type="hidden" {...register('imageUrl')} />
            <input type="hidden" {...register('imagePublicId')} />
          </div>

          <button type="submit" className="bg-[#EA580C] hover:bg-[#F97316] text-white px-6 py-2 rounded-md transition-colors">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
