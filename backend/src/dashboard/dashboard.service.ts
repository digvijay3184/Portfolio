import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Hero } from '../schemas/hero.schema';
import { About } from '../schemas/about.schema';
import { MindsetPrinciple } from '../schemas/mindset-principle.schema';
import { Experience } from '../schemas/experience.schema';
import { Project } from '../schemas/project.schema';
import { ArchitectureDoc } from '../schemas/architecture-doc.schema';
import { ContactMessage } from '../schemas/contact-message.schema';

@Injectable()
export class DashboardService {
  constructor(
    @InjectModel(Hero.name) private heroModel: Model<Hero>,
    @InjectModel(About.name) private aboutModel: Model<About>,
    @InjectModel(MindsetPrinciple.name) private mindsetPrincipleModel: Model<MindsetPrinciple>,
    @InjectModel(Experience.name) private experienceModel: Model<Experience>,
    @InjectModel(Project.name) private projectModel: Model<Project>,
    @InjectModel(ArchitectureDoc.name) private architectureDocModel: Model<ArchitectureDoc>,
    @InjectModel(ContactMessage.name) private contactMessageModel: Model<ContactMessage>,
  ) {}

  async getSummary() {
    // Construct pipeline for Recent Activity Log
    const collections = [
      { model: this.heroModel, name: 'Hero' },
      { model: this.aboutModel, name: 'About' },
      { model: this.mindsetPrincipleModel, name: 'Mindset' },
      { model: this.experienceModel, name: 'Experience' },
      { model: this.projectModel, name: 'Project' },
      { model: this.architectureDocModel, name: 'Architecture' },
    ];

    const pipeline: any[] = [];
    collections.forEach((col, idx) => {
      const collectionName = col.model.collection.name;
      const projectStage = {
        $project: {
          _id: 1,
          title: { $ifNull: ["$title", { $ifNull: ["$name", { $ifNull: ["$company", "Document"] }] }] },
          updatedAt: 1,
          collectionType: col.name
        }
      };

      if (idx === 0) {
        pipeline.push(projectStage);
      } else {
        pipeline.push({
          $unionWith: {
            coll: collectionName,
            pipeline: [projectStage]
          }
        });
      }
    });
    
    pipeline.push({ $sort: { updatedAt: -1 } });
    pipeline.push({ $limit: 10 });

    // Execute all database queries concurrently
    const [
      publishedProjectsCount,
      draftProjectsCount,
      unreadMessagesCount,
      totalExperienceCount,
      hero,
      about,
      mindsetCount,
      architectureCount,
      recentActivity
    ] = await Promise.all([
      this.projectModel.countDocuments({ status: 'published' }).exec(),
      this.projectModel.countDocuments({ status: 'draft' }).exec(),
      this.contactMessageModel.countDocuments({ status: 'new' }).exec(),
      this.experienceModel.countDocuments().exec(),
      this.heroModel.findOne().exec(),
      this.aboutModel.findOne().exec(),
      this.mindsetPrincipleModel.countDocuments().exec(),
      this.architectureDocModel.countDocuments().exec(),
      this.heroModel.aggregate(pipeline).exec()
    ]);

    // 2. Completeness Checklist
    const isHeroComplete = !!(hero && hero.avatarUrl && hero.roles && hero.roles.length > 0);
    const isCvComplete = !!(hero && hero.cvUrl);
    const isAboutComplete = !!(about && about.bio);
    const isMindsetComplete = mindsetCount > 0;
    const isExperienceComplete = totalExperienceCount > 0;
    const isProjectComplete = publishedProjectsCount > 0;
    const isArchitectureComplete = architectureCount > 0;

    // Global Last Updated
    const lastUpdated = recentActivity.length > 0 ? recentActivity[0].updatedAt : null;

    return {
      stats: {
        publishedProjects: publishedProjectsCount,
        draftProjects: draftProjectsCount,
        unreadMessages: unreadMessagesCount,
        totalExperiences: totalExperienceCount,
        lastUpdated
      },
      completeness: {
        hero: isHeroComplete,
        about: isAboutComplete,
        mindset: isMindsetComplete,
        experience: isExperienceComplete,
        projects: isProjectComplete,
        architecture: isArchitectureComplete,
        cv: isCvComplete
      },
      recentActivity
    };
  }

  async getRecentMessages(limit: number = 5) {
    return this.contactMessageModel.find().sort({ createdAt: -1 }).limit(limit).exec();
  }
}
