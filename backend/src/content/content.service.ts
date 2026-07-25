import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
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
export class ContentService {
  constructor(
    @InjectModel(Hero.name) private heroModel: Model<Hero>,
    @InjectModel(About.name) private aboutModel: Model<About>,
    @InjectModel(MindsetPrinciple.name) private mindsetPrincipleModel: Model<MindsetPrinciple>,
    @InjectModel(Experience.name) private experienceModel: Model<Experience>,
    @InjectModel(Project.name) private projectModel: Model<Project>,
    @InjectModel(ArchitectureDoc.name) private architectureDocModel: Model<ArchitectureDoc>,
    @InjectModel(ContactMessage.name) private contactMessageModel: Model<ContactMessage>,
    @InjectModel('SiteSettings') private siteSettingsModel: Model<any>,
  ) {}

  private getModel(modelName: string): Model<any> {
    switch (modelName.toLowerCase()) {
      case 'hero': return this.heroModel;
      case 'about': return this.aboutModel;
      case 'mindset': return this.mindsetPrincipleModel;
      case 'experience': return this.experienceModel;
      case 'project': return this.projectModel;
      case 'architecture': return this.architectureDocModel;
      case 'contact': return this.contactMessageModel;
      case 'site-settings': return this.siteSettingsModel;
      default: throw new BadRequestException(`Unknown model: ${modelName}`);
    }
  }

  private async triggerIsr(modelName: string) {
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const isrSecret = process.env.ISR_SECRET || 'secret123';
    
    // Map models to paths. In real app, we might want a more sophisticated map
    let path = '/';
    if (modelName === 'project') path = '/projects';
    if (modelName === 'architecture') path = '/architecture';

    try {
      await fetch(`${frontendUrl}/api/revalidate?secret=${isrSecret}&path=${path}`, { method: 'POST' });
    } catch (e) {
      console.error(`Failed to trigger ISR for ${modelName}`, e);
      // We don't throw here to avoid failing the mutation just because ISR failed
    }
  }

  async findAll(modelName: string) {
    const model = this.getModel(modelName);
    return model.find().sort({ order: 1, createdAt: -1 }).exec();
  }

  async findOne(modelName: string, id: string) {
    const model = this.getModel(modelName);
    return model.findById(id).exec();
  }

  private async validateWorkTree(workTree: any[]) {
    if (!Array.isArray(workTree) || workTree.length === 0) return;

    const nodeIds = new Set(workTree.map(n => n.nodeId));
    if (nodeIds.size !== workTree.length) {
      throw new BadRequestException('Duplicate nodeId found in workTree');
    }

    const nodeMap = new Map(workTree.map(n => [n.nodeId, n]));

    for (const node of workTree) {
      if (!node.nodeId) throw new BadRequestException('nodeId is required');
      const label = typeof node.label === 'string' ? node.label.trim() : '';
      if (label.length < 1 || label.length > 120) {
        throw new BadRequestException(`Label for node ${node.nodeId} must be between 1 and 120 characters`);
      }

      if (node.parentId && !nodeMap.has(node.parentId)) {
        throw new BadRequestException(`Parent node ${node.parentId} not found in workTree`);
      }

      let depth = 1;
      let current = node;
      const visited = new Set([current.nodeId]);
      
      while (current.parentId) {
        if (visited.has(current.parentId)) {
          throw new BadRequestException(`Cycle detected in workTree involving node ${current.parentId}`);
        }
        depth++;
        if (depth > 4) {
          throw new BadRequestException(`Max depth of 4 exceeded in workTree for node ${node.nodeId}`);
        }
        visited.add(current.parentId);
        current = nodeMap.get(current.parentId);
      }
    }
  }

  async create(modelName: string, data: any) {
    if (modelName.toLowerCase() === 'experience' && data.workTree) {
      await this.validateWorkTree(data.workTree);
    }
    const model = this.getModel(modelName);
    const created = await model.create(data);
    await this.triggerIsr(modelName);
    return created;
  }

  async update(modelName: string, id: string, data: any) {
    if (modelName.toLowerCase() === 'experience' && data.workTree) {
      await this.validateWorkTree(data.workTree);
    }
    const model = this.getModel(modelName);
    const updated = await model.findByIdAndUpdate(id, data, { returnDocument: 'after' }).exec();
    await this.triggerIsr(modelName);
    return updated;
  }

  async remove(modelName: string, id: string) {
    const model = this.getModel(modelName);
    const removed = await model.findByIdAndDelete(id).exec();
    await this.triggerIsr(modelName);
    return removed;
  }
}
