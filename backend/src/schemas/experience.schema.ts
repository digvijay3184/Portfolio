import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

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
}

export const ExperienceSchema = SchemaFactory.createForClass(Experience);
