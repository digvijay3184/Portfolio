import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class AdminUser extends Document {
  @Prop({ required: true, unique: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;

  @Prop({ enum: ['owner'], default: 'owner' })
  role: string;

  @Prop()
  lastLoginAt: Date;

  @Prop()
  refreshTokenHash: string;
}

export const AdminUserSchema = SchemaFactory.createForClass(AdminUser);
