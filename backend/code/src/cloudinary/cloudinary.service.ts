import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor() {}

  async upload(userId: string, url: string) {
    return await cloudinary.uploader.upload(url, {
      folder: 'nest-blog',
      overwrite: true,
      resource_type: 'image',
      unique_filename: false,
      filename_override: userId,
      use_filename: true,
    });
  }
}
