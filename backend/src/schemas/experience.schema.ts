import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ _id: false })
export class WorkNode {
  @Prop({ required: true })
  nodeId: string;

  @Prop({ type: String, default: null })
  parentId: string | null;

  @Prop({ required: true })
  label: string;

  @Prop()
  description: string;

  @Prop({
    type: String,
    enum: ['project', 'feature', 'task', 'milestone'],
    default: 'task',
  })
  type: string;

  @Prop()
  icon: string;

  @Prop({ type: [String] })
  techStack: string[];

  @Prop({ default: 0 })
  order: number;
}
export const WorkNodeSchema = SchemaFactory.createForClass(WorkNode);

@Schema({ timestamps: true })
export class Experience extends Document {
  @Prop({ required: true })
  company: string;

  @Prop({ required: true })
  role: string;

  @Prop()
  logoUrl: string;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ type: Date, default: null })
  endDate: Date; // null = current

  @Prop()
  location: string;

  @Prop()
  description: string;

  @Prop({ type: [String] })
  achievements: string[];

  @Prop({ type: [String] })
  techStack: string[];

  @Prop({ default: 0 })
  order: number;

  @Prop({ type: [WorkNodeSchema], default: [] })
  workTree: WorkNode[];
}

export const ExperienceSchema = SchemaFactory.createForClass(Experience);
