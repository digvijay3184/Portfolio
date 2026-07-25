import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { BullModule } from '@nestjs/bullmq';
import { ContactController } from './contact.controller';
import { ContactService } from './contact.service';
import { ContactProcessor } from './contact.processor';
import { ContactMessage, ContactMessageSchema } from '../schemas/contact-message.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: ContactMessage.name, schema: ContactMessageSchema }]),
    BullModule.registerQueue({
      name: 'email',
    }),
  ],
  controllers: [ContactController],
  providers: [ContactService, ContactProcessor],
})
export class ContactModule {}
