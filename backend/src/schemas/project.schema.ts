import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

class ImplementationChallenge {
  @Prop()
  challenge: string;

  @Prop()
  solution: string;
}

class CaseStudy {
  @Prop()
  problem: string;

  @Prop()
  architectureDiagramUrl: string;

  @Prop()
  architectureDiagramPublicId: string;

  @Prop()
  databaseDesign: string;

  @Prop()
  apiOverview: string;

  @Prop({ type: [Object] })
  implementationChallenges: ImplementationChallenge[];

  @Prop({ type: [String] })
  outcomes: string[];
}

class GalleryItem {
  @Prop()
  url: string;

  @Prop()
  publicId: string;

  @Prop()
  caption: string;
}

@Schema({ timestamps: true })
export class Project extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true, unique: true })
  slug: string;

  @Prop({ required: true })
  summary: string;

  @Prop()
  coverImageUrl: string;

  @Prop()
  coverImagePublicId: string;

  @Prop({ type: [String] })
  techStack: string[];

  @Prop()
  liveUrl: string;

  @Prop()
  repoUrl: string;

  @Prop({ default: false })
  featured: boolean;

  @Prop({ default: 0 })
  order: number;

  @Prop({ type: Object })
  caseStudy: CaseStudy;

  @Prop({ type: [Object] })
  gallery: GalleryItem[];

  @Prop({ enum: ['draft', 'published'], default: 'draft' })
  status: string;
}

export const ProjectSchema = SchemaFactory.createForClass(Project);
