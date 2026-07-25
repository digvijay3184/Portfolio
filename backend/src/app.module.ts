import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ThrottlerModule } from '@nestjs/throttler';
import { BullModule } from '@nestjs/bullmq';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { AdminUser, AdminUserSchema } from './schemas/admin-user.schema';
import { Hero, HeroSchema } from './schemas/hero.schema';
import { About, AboutSchema } from './schemas/about.schema';
import { MindsetPrinciple, MindsetPrincipleSchema } from './schemas/mindset-principle.schema';
import { Experience, ExperienceSchema } from './schemas/experience.schema';
import { Project, ProjectSchema } from './schemas/project.schema';
import { ArchitectureDoc, ArchitectureDocSchema } from './schemas/architecture-doc.schema';
import { ContactMessage, ContactMessageSchema } from './schemas/contact-message.schema';
import { SiteSettings, SiteSettingsSchema } from './schemas/site-settings.schema';
import { MediaModule } from './media/media.module';
import { ContentModule } from './content/content.module';
import { ContactModule } from './contact/contact.module';
import { DashboardModule } from './dashboard/dashboard.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 10,
    }]),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),
    MongooseModule.forFeature([
      { name: AdminUser.name, schema: AdminUserSchema },
      { name: Hero.name, schema: HeroSchema },
      { name: About.name, schema: AboutSchema },
      { name: MindsetPrinciple.name, schema: MindsetPrincipleSchema },
      { name: Experience.name, schema: ExperienceSchema },
      { name: Project.name, schema: ProjectSchema },
      { name: ArchitectureDoc.name, schema: ArchitectureDocSchema },
      { name: ContactMessage.name, schema: ContactMessageSchema },
      { name: SiteSettings.name, schema: SiteSettingsSchema },
    ]),
    BullModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        connection: {
          host: configService.get<string>('REDIS_HOST', 'localhost'),
          port: configService.get<number>('REDIS_PORT', 6379),
          password: configService.get<string>('REDIS_PASSWORD'),
          tls: configService.get<string>('REDIS_HOST')?.includes('upstash') ? {} : undefined,
        },
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    MediaModule,
    ContentModule,
    ContactModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
