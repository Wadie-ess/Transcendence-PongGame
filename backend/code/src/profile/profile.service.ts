import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { ProfileDto } from './dto/profile.dto';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UploadApiResponse, v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

@Injectable()
export class ProfileService {
  constructor(private usersService: UsersService) {}

  async getProfile(
    userId: string,
    friendId?: null | string,
  ): Promise<ProfileDto> {
    if (friendId && friendId !== userId) {
      const blockid = [userId, friendId].sort().join('-');
      const block = await this.usersService.getBlockbyId(blockid);
      if (block) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
    }
    const user = await this.usersService.getUserById(userId);
    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    console.log(user);
    return new ProfileDto(user);
  }

  async updateProfile(
    userId: string,
    update_data: UpdateProfileDto,
  ): Promise<ProfileDto> {
    const user = await this.usersService.updateUser(userId, update_data);
    return new ProfileDto(user);
  }

  async uploadAvatar(userId: string, file: Express.Multer.File) {
    const fStream = new Readable();
    fStream.push(file.buffer);
    fStream.push(null);
    const promise = new Promise<UploadApiResponse>((resolve, reject) => {
      const streamLoad = cloudinary.uploader.upload_stream(
        {
          folder: 'nest-blog',
          overwrite: true,
          resource_type: 'image',
          unique_filename: false,
          filename_override: userId,
          use_filename: true,
        },
        (err, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(err);
          }
        },
      );
      fStream.pipe(streamLoad);
    });

    const result = await promise;
    console.log(result);
    await this.usersService.updateUser(userId, {
      avatar: `v${result.version}/${result.public_id}.${result.format}`,
    });
    return { message: 'avatar uploaded' };
  }

  async getAvatar(recourseId: string) {
    const result = await cloudinary.api.resources_by_asset_ids([recourseId], {
      max_results: 1,
      transformation: [
        { width: 200, height: 200, crop: 'fill' },
        { quality: 'auto' },
      ],
    });
    return result;
  }
}
