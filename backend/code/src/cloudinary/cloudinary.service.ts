import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';

@Injectable()
export class CloudinaryService {
  constructor() {}

  async upload(file: any) {
    return await cloudinary.uploader.upload(file.path, {
      folder: 'tran-avatar',
      overwrite: true,
      resource_type: 'auto',
    });
  }
}
