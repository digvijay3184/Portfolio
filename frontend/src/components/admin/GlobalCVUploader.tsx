'use client';

import { useContent } from '@/lib/hooks/useContent';
import { useMediaUpload, useMediaDelete } from '@/lib/hooks/useMedia';
import { FileUp, FileText } from 'lucide-react';
import toast from 'react-hot-toast';

export default function GlobalCVUploader() {
  const { data, create, update } = useContent('hero');
  const uploadMedia = useMediaUpload();
  const deleteMedia = useMediaDelete();
  
  const heroDoc = data?.[0];

  const onCVFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const toastId = toast.loading('Uploading Global CV...');
    try {
      const { url, publicId } = await uploadMedia.mutateAsync(file);
      
      const payload = {
        name: heroDoc?.name || 'Default Name',
        roles: heroDoc?.roles || [],
        accentColor: heroDoc?.accentColor || '#EA580C',
        ctaLabel: heroDoc?.ctaLabel || 'Contact Me',
        cvUrl: url,
        cvPublicId: publicId,
        avatarUrl: heroDoc?.avatarUrl,
        avatarPublicId: heroDoc?.avatarPublicId,
      };

      if (heroDoc) {
        if (heroDoc.cvPublicId) {
          try {
             await deleteMedia.mutateAsync(heroDoc.cvPublicId);
          } catch (e) {
             // Ignore if file doesn't exist
          }
        }
        await update({ id: heroDoc._id, data: payload });
      } else {
        await create(payload);
      }
      
      toast.success('Global CV updated successfully!', { id: toastId });
    } catch (err) {
      toast.error('Failed to upload CV', { id: toastId });
    }
  };

  return (
    <div className="flex items-center gap-4">
      {heroDoc?.cvUrl && (
        <a 
          href={heroDoc.cvUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex items-center gap-2 text-sm text-[#9CA3AF] hover:text-[#EA580C] transition-colors"
        >
          <FileText size={16} />
          <span>View Current CV</span>
        </a>
      )}
      
      <label className="flex items-center gap-2 px-4 py-2 bg-[#1A1A1A] border border-[#333333] hover:bg-[#222222] text-white rounded-md transition-colors cursor-pointer text-sm font-medium">
        <FileUp size={16} className="text-[#EA580C]" />
        <span>Upload CV (PDF)</span>
        <input 
          type="file" 
          accept="application/pdf" 
          onChange={onCVFileChange} 
          className="hidden" 
        />
      </label>
    </div>
  );
}
