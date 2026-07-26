import { 
  LayoutDashboard, 
  User, 
  FileText, 
  Image, 
  Briefcase, 
  Mail, 
  Lightbulb, 
  Network, 
  Settings 
} from 'lucide-react';

export const navItems = [
  { name: 'Dashboard', href: '/system-console', icon: LayoutDashboard },
  { name: 'Hero', href: '/system-console/hero', icon: User },
  { name: 'About', href: '/system-console/about', icon: FileText },
  { name: 'Mindset', href: '/system-console/mindset', icon: Lightbulb },
  { name: 'Experience', href: '/system-console/experience', icon: Briefcase },
  { name: 'Projects', href: '/system-console/projects', icon: Image },
  { name: 'Architecture', href: '/system-console/architecture', icon: Network },
  { name: 'Messages', href: '/system-console/messages', icon: Mail },
  { name: 'Settings', href: '/system-console/settings', icon: Settings },
];
