import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class SiteSettings extends Document {
  @Prop({ default: true })
  customCursorEnabled: boolean;

  // Dashboard Settings
  @Prop({ default: true })
  showDashboardStats: boolean;

  @Prop({ default: true })
  showRecentMessages: boolean;

  @Prop({ default: true })
  showContentCompleteness: boolean;

  @Prop({ default: true })
  showQuickActions: boolean;

  @Prop({ default: true })
  showActivityLog: boolean;

  // Public Site Settings
  @Prop({ default: true })
  showAboutSection: boolean;

  @Prop({ default: true })
  showMindsetSection: boolean;

  @Prop({ default: true })
  showExperienceSection: boolean;

  @Prop({ default: true })
  showProjectsSection: boolean;

  @Prop({ default: true })
  showArchitectureSection: boolean;

  @Prop({ default: true })
  showContactSection: boolean;

  @Prop({ type: [String], default: ['hero', 'about', 'mindset', 'experience', 'projects', 'architecture', 'contact'] })
  sectionOrder: string[];
}

export const SiteSettingsSchema = SchemaFactory.createForClass(SiteSettings);
