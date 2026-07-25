import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class ArchitectureDoc extends Document {
  @Prop()
  title: string;

  @Prop()
  diagramUrl: string;

  @Prop()
  diagramPublicId: string;

  @Prop()
  description: string;

  @Prop({ default: 0 })
  order: number;
}

export const ArchitectureDocSchema = SchemaFactory.createForClass(ArchitectureDoc);
