import { Test, TestingModule } from '@nestjs/testing';
import { ContentService } from './content.service';
import { getModelToken } from '@nestjs/mongoose';
import { Hero } from '../schemas/hero.schema';
import { About } from '../schemas/about.schema';
import { MindsetPrinciple } from '../schemas/mindset-principle.schema';
import { Experience } from '../schemas/experience.schema';
import { Project } from '../schemas/project.schema';
import { ArchitectureDoc } from '../schemas/architecture-doc.schema';
import { ContactMessage } from '../schemas/contact-message.schema';

const mockModel = {
  find: jest.fn().mockReturnThis(),
  sort: jest.fn().mockReturnThis(),
  exec: jest.fn().mockResolvedValue([{ _id: '123' }]),
  findById: jest.fn().mockReturnThis(),
  create: jest.fn().mockResolvedValue({ _id: '123' }),
  findByIdAndUpdate: jest.fn().mockReturnThis(),
  findByIdAndDelete: jest.fn().mockReturnThis(),
};

describe('ContentService', () => {
  let service: ContentService;

  beforeEach(async () => {
    // Mock global fetch to prevent ISR triggers from failing or logging errors
    global.fetch = jest.fn(() => Promise.resolve(new Response()));

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContentService,
        { provide: getModelToken(Hero.name), useValue: mockModel },
        { provide: getModelToken(About.name), useValue: mockModel },
        { provide: getModelToken(MindsetPrinciple.name), useValue: mockModel },
        { provide: getModelToken(Experience.name), useValue: mockModel },
        { provide: getModelToken(Project.name), useValue: mockModel },
        { provide: getModelToken(ArchitectureDoc.name), useValue: mockModel },
        { provide: getModelToken(ContactMessage.name), useValue: mockModel },
      ],
    }).compile();

    service = module.get<ContentService>(ContentService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of items', async () => {
      const result = await service.findAll('hero');
      expect(result).toEqual([{ _id: '123' }]);
      expect(mockModel.find).toHaveBeenCalled();
    });

    it('should throw BadRequestException for unknown model', async () => {
      await expect(service.findAll('unknown')).rejects.toThrow('Unknown model: unknown');
    });
  });

  describe('create', () => {
    it('should create an item and trigger ISR', async () => {
      const result = await service.create('hero', { name: 'Test' });
      expect(result).toEqual({ _id: '123' });
      expect(mockModel.create).toHaveBeenCalledWith({ name: 'Test' });
      expect(global.fetch).toHaveBeenCalled();
    });
  });
});
