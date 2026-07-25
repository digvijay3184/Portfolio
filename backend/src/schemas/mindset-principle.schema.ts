import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class MindsetPrinciple extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop()
  icon: string;

  @Prop({ default: 0 })
  order: number;
}

export const MindsetPrincipleSchema = SchemaFactory.createForClass(MindsetPrinciple);
