export default function Architecture({ data }: { data: any[] }) {
  if (!data || data.length === 0) return null;

  return (
    <section className="py-24 bg-[#050505] text-white border-t border-[#222222]">
      <div className="container mx-auto px-6 max-w-5xl">
        <h2 className="text-3xl font-bold mb-12 text-center">System Architecture</h2>
        
        <div className="space-y-16">
          {data.map((doc) => (
            <div key={doc._id} className="glass-panel p-8 rounded-2xl flex flex-col gap-8">
              <div>
                <h3 className="text-2xl font-bold mb-4">{doc.title}</h3>
                <p className="text-[#9CA3AF] leading-relaxed mb-6">{doc.description}</p>
                
                {/* Normally we'd use react-markdown here for `doc.content`, but simple pre-wrap works for now */}
                <div className="text-sm text-[#9CA3AF] bg-[#121212] p-6 rounded-xl border border-[#222222] whitespace-pre-wrap font-mono overflow-x-auto">
                  {doc.content}
                </div>
              </div>
              
              {doc.diagramUrl && (
                <div className="relative aspect-video rounded-xl overflow-hidden bg-[#121212] border border-[#222222]">
                  <img src={doc.diagramUrl} alt={doc.title} className="w-full h-full object-contain p-4" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
