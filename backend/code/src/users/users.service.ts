import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Prisma } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';
import { NotFoundError } from 'rxjs';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: CreateUserDto) {
    return await this.prisma.user
      .create({
        data,
      })
      .catch((err) => {
        if (err instanceof Prisma.PrismaClientKnownRequestError) {
          if (err.code === 'P2002') {
            throw new ConflictException('User already exists');
          }
        }
        throw err;
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
    }).catch((err) => {
		if ( err instanceof Prisma.PrismaClientKnownRequestError)
		{
			if ( err.code === 'P2025')
			{
				throw new UnauthorizedException('Invalid credentials');
			}
		}
		throw new Error('Unknown error');
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
