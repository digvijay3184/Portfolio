import { Controller, Post, Body } from '@nestjs/common';
import { ContactService } from './contact.service';

@Controller('contact')
export class ContactController {
  constructor(private readonly contactService: ContactService) {}

  @Post()
  async submitForm(@Body() data: { name: string; email: string; message: string }) {
    return this.contactService.submitContactForm(data);
  }
}
