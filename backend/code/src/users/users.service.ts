import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

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
                  is_blocked: true,
                  blocked_by_id: true,
                },
              },
              right_friends: {
                select: {
                  accepted: true,
                  fromId: true,
                  toId: true,
                  is_blocked: true,
                  blocked_by_id: true,
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
}
