import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Prisma } from '@prisma/client';
import { UpdateUserDto } from './dto/update-user.dto';

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

  async getUserById(id: string) {
    return await this.prisma.user.findUnique({
      where: { id },
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

  async updateUser(id: string, data: UpdateUserDto) {
    return await this.prisma.user.update({
      where: { id },
      data,
    });
  }

  async deleteUser(id: string) {
    return await this.prisma.user.delete({
      where: { id },
    });
  }

  async deleteAllUsers() {
    return await this.prisma.user.deleteMany();
  }
}
