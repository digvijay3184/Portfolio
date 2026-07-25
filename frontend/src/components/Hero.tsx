import HeroCanvas from './HeroCanvas';
import { motion } from 'framer-motion';

import HeroMorphHeading from './ui/HeroMorphHeading';
import EncryptButton from './ui/EncryptButton';

export default function Hero({ data }: { data: any }) {
  if (!data) return null;

  // Morph between Name and CTA Label
  const morphWords = [data.name, data.ctaLabel].filter(Boolean);

  return (
    <section className="relative w-full h-screen flex items-center justify-center overflow-hidden">
      {/* 3D Canvas Background */}
      <div className="absolute inset-0 z-0">
        <HeroCanvas accentColor={data.accentColor} />
      </div>

      <div className="z-10 container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Avatar Side */}
        <div className="flex justify-center md:justify-end">
          <div className="relative w-64 h-64 md:w-96 md:h-96 glass-panel rounded-full p-2 flex items-center justify-center">
            {data.avatarUrl ? (
              <img 
                src={data.avatarUrl} 
                alt={data.name} 
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <span className="text-[#9CA3AF] text-xl font-medium tracking-widest uppercase">
                {data.name?.charAt(0) || 'Hi'}
              </span>
            )}
          </div>
        </div>

        {/* Text Side */}
        <div className="flex flex-col items-start space-y-6">
          <HeroMorphHeading words={morphWords} />
          
          <div className="text-2xl md:text-3xl text-[#9CA3AF] h-10">
            {data.roles?.join(' • ')}
          </div>

          <div className="flex gap-4 mt-8">
            <EncryptButton 
              href="#contact" 
              label={data.ctaLabel} 
              className="shadow-[0_0_15px_rgba(234,88,12,0.3)] hover:shadow-[0_0_25px_rgba(234,88,12,0.5)] backdrop-blur-md"
            />
            {data.cvUrl && (
              <a 
                href={data.cvUrl.startsWith('/uploads') ? `${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001'}${data.cvUrl}` : data.cvUrl}
                target="_blank" 
                rel="noreferrer"
                className="px-8 py-3 rounded-full border border-[#222222] hover:bg-[#222222] transition-colors text-white font-medium"
              >
                See My CV
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
