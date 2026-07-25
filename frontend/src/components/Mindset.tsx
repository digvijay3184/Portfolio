export default function Mindset({ data }: { data: any[] }) {
  if (!data || data.length === 0) return null;

  return (
    <section className="py-24 bg-[#050505] text-white border-t border-[#222222]">
      <div className="container mx-auto px-6 max-w-6xl">
        <h2 className="text-3xl font-bold mb-12 text-center">Engineering Mindset</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.map((principle) => (
            <div key={principle._id} className="glass-panel p-6 rounded-2xl flex flex-col hover:border-[#EA580C]/50 transition-colors duration-300">
              <div className="w-12 h-12 rounded-full bg-[#121212] flex items-center justify-center mb-6 border border-[#222222]">
                <span className="text-[#EA580C] font-bold">{principle.iconName || '✦'}</span>
              </div>
              <h3 className="text-xl font-semibold mb-3">{principle.title}</h3>
              <p className="text-[#9CA3AF] text-sm leading-relaxed mb-4 flex-1">
                {principle.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
