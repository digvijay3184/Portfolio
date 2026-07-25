import { z } from 'zod';

export const heroSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  roles: z.string().or(z.array(z.string())), // Can be string (comma separated) or array
  accentColor: z.string().regex(/^#([0-9A-F]{3}){1,2}$/i, 'Must be a valid hex color').default('#EA580C'),
  ctaLabel: z.string().default('Contact Me'),
  cvUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  cvPublicId: z.string().optional().or(z.literal('')),
  avatarUrl: z.string().url().optional().or(z.literal('')),
  avatarPublicId: z.string().optional().or(z.literal('')),
});

export const aboutSchema = z.object({
  heading: z.string().optional(),
  bio: z.string().min(1, 'Bio is required'),
  imageUrl: z.string().url().optional().or(z.literal('')),
  imagePublicId: z.string().optional().or(z.literal('')),
});

const workNodeSchema = z.object({
  nodeId: z.string(),
  parentId: z.string().nullable(),
  label: z.string(),
  description: z.string().optional(),
  type: z.enum(['project', 'feature', 'task', 'milestone']).default('task'),
  icon: z.string().optional(),
  techStack: z.array(z.string()).optional(),
  order: z.number().default(0)
});

export const experienceSchema = z.object({
  company: z.string().min(1, 'Company is required'),
  role: z.string().min(1, 'Role is required'),
  startDate: z.string().regex(/^\d{4}-\d{2}(-\d{2})?$/, 'Must be YYYY-MM or YYYY-MM-DD format'),
  endDate: z.string().regex(/^\d{4}-\d{2}(-\d{2})?$/, 'Must be YYYY-MM or YYYY-MM-DD format').optional().or(z.literal('')),
  achievements: z.string().or(z.array(z.string())), // Can be string with \n or array
  workTree: z.array(workNodeSchema).optional(),
});

export const projectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  summary: z.string().min(1, 'Summary is required'),
  techStack: z.string().or(z.array(z.string())), // string or array
  liveUrl: z.string().url().optional().or(z.literal('')),
  repoUrl: z.string().url().optional().or(z.literal('')),
  coverImageUrl: z.string().url().optional().or(z.literal('')),
  coverImagePublicId: z.string().optional().or(z.literal('')),
});

export const mindsetSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  icon: z.string().optional(),
  order: z.number().default(0),
});

export const architectureSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  diagramUrl: z.string().url().optional().or(z.literal('')),
  diagramPublicId: z.string().optional().or(z.literal('')),
  order: z.number().default(0),
});
