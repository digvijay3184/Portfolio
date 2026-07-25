import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ContentController } from './content.controller';
import { ContentService } from './content.service';
import { Hero, HeroSchema } from '../schemas/hero.schema';
import { About, AboutSchema } from '../schemas/about.schema';
import { MindsetPrinciple, MindsetPrincipleSchema } from '../schemas/mindset-principle.schema';
import { Experience, ExperienceSchema } from '../schemas/experience.schema';
import { Project, ProjectSchema } from '../schemas/project.schema';
import { ArchitectureDoc, ArchitectureDocSchema } from '../schemas/architecture-doc.schema';
import { ContactMessage, ContactMessageSchema } from '../schemas/contact-message.schema';
import { SiteSettings, SiteSettingsSchema } from '../schemas/site-settings.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Hero.name, schema: HeroSchema },
      { name: About.name, schema: AboutSchema },
      { name: MindsetPrinciple.name, schema: MindsetPrincipleSchema },
      { name: Experience.name, schema: ExperienceSchema },
      { name: Project.name, schema: ProjectSchema },
      { name: ArchitectureDoc.name, schema: ArchitectureDocSchema },
      { name: ContactMessage.name, schema: ContactMessageSchema },
      { name: SiteSettings.name, schema: SiteSettingsSchema },
    ]),
  ],
  controllers: [ContentController],
  providers: [ContentService],
})
export class ContentModule {}
