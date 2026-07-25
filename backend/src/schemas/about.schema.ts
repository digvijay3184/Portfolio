import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class About extends Document {
  @Prop()
  heading: string;

  @Prop({ required: true })
  bio: string;

  @Prop({ type: [String] })
  highlights: string[];

  @Prop()
  imageUrl: string;

  @Prop()
  imagePublicId: string;
}

export const AboutSchema = SchemaFactory.createForClass(About);
