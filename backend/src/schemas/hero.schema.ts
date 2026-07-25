import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class Hero extends Document {
  @Prop({ required: true })
  name: string;

  @Prop({ type: [String], required: true })
  roles: string[];

  @Prop()
  avatarUrl: string;

  @Prop()
  avatarPublicId: string;

  @Prop({ default: '#EA580C' })
  accentColor: string;

  @Prop({ default: 'Contact Me' })
  ctaLabel: string;

  @Prop()
  cvUrl: string;

  @Prop()
  cvPublicId: string;
}

export const HeroSchema = SchemaFactory.createForClass(Hero);
