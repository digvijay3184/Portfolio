import { ArrowUpRight, FolderGit2 } from 'lucide-react';
import ProjectGallery from './ProjectGallery';
export default function Projects({ data }: { data: any[] }) {
  if (!data || data.length === 0) return null;

  return (
    <section className="py-24 bg-[#050505] text-white border-t border-[#222222]">
      <div className="container mx-auto px-6 max-w-6xl">
        <h2 className="text-3xl font-bold mb-12 text-center">Featured Projects</h2>
        
        <div className="space-y-16">
          {data.map((project, index) => (
            <div key={project._id} className={`flex flex-col ${index % 2 === 1 ? 'lg:flex-row-reverse' : 'lg:flex-row'} gap-10 items-center`}>
              {/* Image Side */}
              <div className="w-full lg:w-1/2">
                <div className="glass-panel p-2 rounded-2xl group overflow-hidden" data-cursor="card">
                  <div className="relative aspect-video overflow-hidden rounded-xl bg-[#121212]">
                    <ProjectGallery 
                      images={[
                        ...(project.coverImageUrl ? [project.coverImageUrl] : []),
                        ...(project.gallery?.map((g: any) => g.url) || [])
                      ]} 
                      title={project.title} 
                    />
                  </div>
                </div>
              </div>

              {/* Content Side */}
              <div className="w-full lg:w-1/2 flex flex-col items-start">
                <h3 className="text-3xl font-bold mb-4 hover:text-[#EA580C] transition-colors">
                  {project.title}
                </h3>
                <div className="glass-panel p-6 rounded-2xl w-full mb-6 z-10 relative">
                  <p className="text-[#9CA3AF] leading-relaxed">
                    {project.summary}
                  </p>
                </div>
                
                <div className="flex flex-wrap gap-3 mb-8">
                  {project.techStack?.map((tech: string, i: number) => (
                    <span key={i} className="text-sm font-mono text-[#EA580C]">
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex items-center gap-6">
                  {project.repoUrl && (
                    <a href={project.repoUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-[#9CA3AF] hover:text-white transition-colors">
                      <FolderGit2 size={20} />
                      <span className="text-sm font-medium">Source</span>
                    </a>
                  )}
                  {project.liveUrl && (
                    <a href={project.liveUrl} target="_blank" rel="noreferrer" className="flex items-center gap-2 text-[#9CA3AF] hover:text-white transition-colors">
                      <ArrowUpRight size={20} />
                      <span className="text-sm font-medium">Live Demo</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
