export default function About({ data }: { data: any }) {
  if (!data) return null;

  return (
    <section className="py-24 bg-[#050505] text-white">
      <div className="container mx-auto px-6 max-w-4xl">
        <h2 className="text-3xl font-bold mb-8 text-center">{data.heading || 'About Me'}</h2>
        
        <div className="glass-panel p-8 rounded-2xl mb-8 flex flex-col md:flex-row gap-8 items-center md:items-start">
          {data.imageUrl && (
            <div className="w-full md:w-1/3 flex-shrink-0">
              <img 
                src={data.imageUrl} 
                alt="About" 
                className="w-full aspect-square object-cover rounded-xl border border-[#222222] shadow-xl"
              />
            </div>
          )}
          <div className="flex-1">
            <p className="text-lg text-[#9CA3AF] whitespace-pre-wrap leading-relaxed">
              {data.bio}
            </p>
          </div>
        </div>

        {data.highlights && data.highlights.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-12">
            {data.highlights.map((highlight: string, i: number) => (
              <div key={i} className="flex items-center gap-4 bg-[#121212] border border-[#222222] p-4 rounded-xl">
                <div className="w-2 h-2 rounded-full bg-[#EA580C]" />
                <span className="text-[#9CA3AF]">{highlight}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
