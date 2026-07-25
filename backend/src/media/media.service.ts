import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary, UploadApiResponse, UploadApiErrorResponse } from 'cloudinary';

@Injectable()
export class MediaService {
  constructor(private configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: this.configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: this.configService.get<string>('CLOUDINARY_API_SECRET'),
    });
  }

  async uploadFile(file: Express.Multer.File): Promise<{ url: string; publicId: string }> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    const isPdf = file.mimetype === 'application/pdf';
    const resourceType = isPdf ? 'raw' : 'auto';

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'portfolio', resource_type: resourceType as any },
        (error: UploadApiErrorResponse, result: UploadApiResponse) => {
          if (error) {
            return reject(new InternalServerErrorException('Cloudinary upload failed'));
          }
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
          });
        },
      );
      
      // Node.js v16+ requires an explicit cast or handling if using raw buffers to stream
      import('stream').then(stream => {
        const pass = new stream.PassThrough();
        pass.end(file.buffer);
        pass.pipe(uploadStream);
      });
    });
  }

  async deleteFile(publicId: string): Promise<void> {
    if (!publicId) return;
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (e) {
      throw new InternalServerErrorException('Failed to delete image from Cloudinary');
    }
  }
}
