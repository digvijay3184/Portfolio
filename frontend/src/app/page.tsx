import { fetchContent } from '@/lib/fetchData';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Mindset from '@/components/Mindset';
import Experience from '@/components/Experience';
import Projects from '@/components/Projects';
import Architecture from '@/components/Architecture';
import Contact from '@/components/Contact';
import FadeIn from '@/components/ui/FadeIn';
import ScrollSpy from '@/components/ui/ScrollSpy';

export const revalidate = 3600;

export default async function Home() {
  const [heroes, about, mindset, experience, projects, architecture, settings] = await Promise.all([
    fetchContent('hero'),
    fetchContent('about'),
    fetchContent('mindset'),
    fetchContent('experience'),
    fetchContent('project'),
    fetchContent('architecture'),
    fetchContent('site-settings'),
  ]);

  const heroData = heroes?.[0] || null;
  const aboutData = about?.[0] || null;
  const publishedProjects = projects?.filter((p: any) => p.status === 'published') || [];
  const siteSettings = settings?.[0] || {};

  const sectionMap: Record<string, React.ReactNode> = {
    hero: (
      <div id="hero" key="hero">
        {heroData && <Hero data={heroData} />}
      </div>
    ),
    about: aboutData && siteSettings.showAboutSection !== false ? <FadeIn id="about" key="about"><About data={aboutData} /></FadeIn> : null,
    mindset: mindset && siteSettings.showMindsetSection !== false ? <FadeIn id="mindset" key="mindset"><Mindset data={mindset} /></FadeIn> : null,
    experience: experience && siteSettings.showExperienceSection !== false ? <FadeIn id="experience" key="experience"><Experience data={experience} /></FadeIn> : null,
    projects: publishedProjects.length > 0 && siteSettings.showProjectsSection !== false ? <FadeIn id="projects" key="projects"><Projects data={publishedProjects} /></FadeIn> : null,
    architecture: architecture && siteSettings.showArchitectureSection !== false ? <FadeIn id="architecture" key="architecture"><Architecture data={architecture} /></FadeIn> : null,
    contact: siteSettings.showContactSection !== false ? <FadeIn id="contact" key="contact"><Contact /></FadeIn> : null
  };

  const defaultOrder = ['hero', 'about', 'mindset', 'experience', 'projects', 'architecture', 'contact'];
  const order = siteSettings.sectionOrder?.length > 0 ? siteSettings.sectionOrder : defaultOrder;

  return (
    <main className="flex flex-col min-h-screen relative">
      <ScrollSpy sectionOrder={order} />
      {order.map((key: string) => sectionMap[key])}
    </main>
  );
}
