import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Resend } from 'resend';

@Processor('email')
export class ContactProcessor extends WorkerHost {
  private resend: Resend;

  constructor() {
    super();
    this.resend = new Resend(process.env.RESEND_API_KEY || 're_dummy');
  }

  async process(job: Job<any, any, string>): Promise<any> {
    switch (job.name) {
      case 'send-notification': {
        const { name, email, content } = job.data;
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@portfolio.local';

        try {
          const result = await this.resend.emails.send({
            from: 'Portfolio <onboarding@resend.dev>',
            to: adminEmail,
            subject: `New Contact Request from ${name}`,
            html: `
              <h2>New Message from Portfolio</h2>
              <p><strong>Name:</strong> ${name}</p>
              <p><strong>Email:</strong> ${email}</p>
              <br/>
              <p><strong>Message:</strong></p>
              <p>${content}</p>
            `,
          });
          return result;
        } catch (error) {
          console.error('Failed to send email:', error);
          throw error;
        }
      }
    }
  }
}
