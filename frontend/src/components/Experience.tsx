export default function Experience({ data }: { data: any[] }) {
  if (!data || data.length === 0) return null;

  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <section className="py-24 bg-[#050505] text-white">
      <div className="container mx-auto px-6 max-w-4xl">
        <h2 className="text-3xl font-bold mb-16 text-center">Experience</h2>
        
        <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-[#222222] before:to-transparent">
          {data.map((job, idx) => (
            <div key={job._id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
              {/* Timeline dot */}
              <div className="flex items-center justify-center w-10 h-10 rounded-full border border-[#222222] bg-[#121212] group-hover:border-[#EA580C] text-[#EA580C] shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 transition-colors duration-300">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 16 16"><path d="M8 0a8 8 0 1 0 8 8 8.009 8.009 0 0 0-8-8Zm0 12a4 4 0 1 1 0-8 4 4 0 0 1 0 8Z" /></svg>
              </div>
              
              {/* Content box */}
              <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] glass-panel p-6 rounded-2xl hover:border-[#EA580C]/50 transition-colors duration-300">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
                  <h3 className="font-bold text-xl text-white">{job.role}</h3>
                  <div className="text-sm font-medium text-[#EA580C]">
                    {formatDate(job.startDate)} — {job.endDate ? formatDate(job.endDate) : 'Present'}
                  </div>
                </div>
                <div className="text-[#9CA3AF] font-medium mb-4">{job.company}</div>
                <p className="text-sm text-[#9CA3AF] leading-relaxed mb-4 whitespace-pre-line">
                  {job.description}
                </p>
                {job.techStack && job.techStack.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-4">
                    {job.techStack.map((tech: string, i: number) => (
                      <span key={i} className="text-xs bg-[#121212] border border-[#222222] px-2 py-1 rounded text-[#9CA3AF]">
                        {tech}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
