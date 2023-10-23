import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { NAME, PICTURE } from '../profile/dto/profile.dto';

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

  async getUserById(userId: string, includeFriends?: boolean) {
    return await this.prisma.user.findUnique({
      where: { userId },
      ...(includeFriends
        ? {
            include: {
              left_friends: {
                select: {
                  accepted: true,
                  fromId: true,
                  toId: true,
                },
              },
              right_friends: {
                select: {
                  accepted: true,
                  fromId: true,
                  toId: true,
                },
              },
              owned_rooms: {
                select: {
                  id: true,
                },
              },
              roomMember: {
                select: {
                  roomId: true,
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

  async getUsers(name: string) {
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
        ],
        NOT: {
          blocked_by: {
            some: {
              Blcoked_by: {
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
                ],
              },
            },
          },
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
      return { name , id: user.userId, avatar };
    });
  }
}
