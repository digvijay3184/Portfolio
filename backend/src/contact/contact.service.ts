import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { ContactMessage } from '../schemas/contact-message.schema';

@Injectable()
export class ContactService {
  constructor(
    @InjectModel(ContactMessage.name) private contactModel: Model<ContactMessage>,
    @InjectQueue('email') private emailQueue: Queue,
  ) {}

  async submitContactForm(data: { name: string; email: string; message: string }) {
    if (!data.name || !data.email || !data.message) {
      throw new BadRequestException('Missing required fields');
    }

    // Save to database
    const message = await this.contactModel.create({
      name: data.name,
      email: data.email,
      message: data.message,
    });

    // Add to BullMQ queue for async processing
    await this.emailQueue.add('send-notification', {
      messageId: (message as any)._id,
      name: data.name,
      email: data.email,
      content: data.message,
    }, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 1000 },
    });

    return { success: true, messageId: (message as any)._id };
  }
}
