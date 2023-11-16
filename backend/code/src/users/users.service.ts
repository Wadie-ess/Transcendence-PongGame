import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { NAME, PICTURE } from '../profile/dto/profile.dto';
import { authenticator } from 'otplib';
import { TwoFactorDto, TwoFactorAction } from './dto/two-factor.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: CreateUserDto) {
    return await this.prisma.user.create({
      data,
    });
  }

  async getAllUsers() {
    return await this.prisma.user.findMany();
  }

  async getUserById(userId: string, friendId?: string) {
    return await this.prisma.user.findUnique({
      where: { userId },
      ...(friendId
        ? {
            include: {
              left_friends: {
                where: {
                  id: [userId, friendId].sort().join('-'),
                },
                select: {
                  accepted: true,
                  fromId: true,
                  toId: true,
                },
              },
              right_friends: {
                where: {
                  id: [userId, friendId].sort().join('-'),
                },
                select: {
                  accepted: true,
                  fromId: true,
                  toId: true,
                },
              },
            },
          }
        : {}),
    });
  }

  async getUserByIntraId(intraId: string) {
    return await this.prisma.user.findUnique({
      where: { intraId },
    });
  }

  async getUserByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: { email },
    });
  }

  async updateUser(userId: string, data: UpdateUserDto) {
    return await this.prisma.user.update({
      where: { userId },
      data,
    });
  }

  async deleteUser(userId: string) {
    return await this.prisma.user.delete({
      where: { userId },
    });
  }

  async deleteAllUsers() {
    return await this.prisma.user.deleteMany();
  }

  async getBlockbyId(blockId: string) {
    return await this.prisma.blockedUsers.findUnique({
      where: {
        id: blockId,
      },
    });
  }

  async getUsers(name: string, currentUserId: string) {
    const users = await this.prisma.user.findMany({
      take: 5,
      where: {
        OR: [
          {
            firstName: {
              contains: name,
              mode: 'insensitive',
            },
          },
          {
            lastName: {
              contains: name,
              mode: 'insensitive',
            },
          },
          {
            Username: {
              contains: name,
              mode: 'insensitive',
            },
          },
        ],
        NOT: {
          OR: [
            {
              blocked_by: {
                some: {
                  blocked_id: currentUserId,
                },
              },
            },
            {
              blocked: {
                some: {
                  blocked_by_id: currentUserId,
                },
              },
            },
          ],
        },
      },
    });
    return users.map((user) => {
      const name: NAME = { first: user.firstName, last: user.lastName };
      const avatar: PICTURE = {
        thumbnail: `https://res.cloudinary.com/trandandan/image/upload/c_thumb,h_48,w_48/${user.avatar}`,
        medium: `https://res.cloudinary.com/trandandan/image/upload/c_thumb,h_72,w_72/${user.avatar}`,
        large: `https://res.cloudinary.com/trandandan/image/upload/c_thumb,h_128,w_128/${user.avatar}`,
      };
      return { name, id: user.userId, avatar };
    });
  }

  async twoFactorAuth(userId: string, dataDto: TwoFactorDto) {
    const user = await this.prisma.user.findUnique({
      where: { userId },
    });

    if (!user) {
      throw new HttpException('User not found', 404);
    }

    if (dataDto.action === TwoFactorAction.ENABLE && !user.tfaEnabled) {
      // generate a top with the same secret
      const isValid = authenticator.verify({
        token: dataDto.otp,
        secret: dataDto.secret,
      });

      if (!isValid) {
        throw new HttpException('Invalid OTP', 400);
      }
      await this.prisma.user.update({
        where: { userId },
        data: {
          tfaEnabled: true,
          tfaSecret: dataDto.secret,
        },
      });
      return { message: 'Two factor authentication enabled' };
    }

    if (dataDto.action === TwoFactorAction.DISABLE && user.tfaEnabled) {
      const isValid = authenticator.verify({
        token: dataDto.otp,
        secret: user.tfaSecret,
      });

      if (!isValid) {
        throw new HttpException('Invalid OTP', 400);
      }

      await this.prisma.user.update({
        where: { userId },
        data: {
          tfaEnabled: false,
          tfaSecret: null,
        },
      });

      return { message: 'Two factor authentication disabled' };
    }
  }
}
