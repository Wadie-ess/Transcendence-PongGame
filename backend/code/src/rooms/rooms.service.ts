import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateRoomDto } from './dto/create-room.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { JoinRoomDto } from './dto/join-room.dto';
import { LeaveRoomDto } from './dto/leave-room.dto';
import { DeleteRoomDto } from './dto/delete-room.dto';
import { ChangeOwnerDto } from './dto/change-owner.dto';
import * as bcrypt from 'bcrypt';
import { UpdateRoomDto } from './dto/update-room.dto';

@Injectable()
export class RoomsService {
  constructor(private prisma: PrismaService) {}

  async createRoom(roomData: CreateRoomDto, roomOwnerId: string) {
    if (roomData.type == 'protected' && !roomData.password) {
      throw new HttpException(
        'missing password for protected room',
        HttpStatus.BAD_REQUEST,
      );
    } else if (roomData.type == 'protected' && roomData.password) {
      roomData.password = await bcrypt.hash(roomData.password, 10);
    }

    return await this.prisma.room.create({
      data: {
        ...roomData,
        owner: {
          connect: { userId: roomOwnerId },
        },
      },
    });
  }

  async joinRoom(roomData: JoinRoomDto, userId: string) {
    const room = await this.prisma.room.findUnique({
      where: { id: roomData.roomId },
      select: { type: true, password: true },
    });
    if (!room) throw new HttpException('room not found', HttpStatus.NOT_FOUND);
    if (room.type == 'protected') {
      const isPasswordCorrect = await bcrypt.compare(
        roomData.password,
        room.password,
      );
      if (!isPasswordCorrect) {
        throw new UnauthorizedException('wrong password');
      }
    }
    await this.prisma.roomMember.create({
      data: {
        user: {
          connect: { userId: userId },
        },
        room: {
          connect: { id: roomData.roomId },
        },
      },
    });

    return { message: 'joined room successfully' };
  }

  async leaveRoom(memberData: LeaveRoomDto, userId: string) {
    const { ownerId } = await this.prisma.room.findUnique({
      where: { id: memberData.roomId },
      select: { ownerId: true },
    });
    if (ownerId === userId)
      throw new UnauthorizedException('You are the owner of this room');
    return await this.prisma.roomMember.delete({
      where: {
        unique_user_room: {
          userId,
          roomId: memberData.roomId,
        },
      },
    });
  }

  async deleteRoom(roomData: DeleteRoomDto, userId: string) {
    const room = await this.prisma.room.findUnique({
      where: { id: roomData.roomId },
      select: { ownerId: true },
    });
    if (!room) throw new HttpException('room not found', HttpStatus.NOT_FOUND);
    if (room.ownerId !== userId) {
      throw new UnauthorizedException('you are not the owner of this room');
    }
    await this.prisma.room.delete({ where: { id: roomData.roomId } });
    return { message: 'deleted room successfully' };
  }

  async updateRoom(roomData: UpdateRoomDto, userId: string) {
    const roomId = roomData.roomId;
    delete roomData.roomId;
    const room = await this.prisma.room.findUnique({
      where: { id: roomId },
      select: { ownerId: true },
    });
    if (!room) throw new HttpException('room not found', HttpStatus.NOT_FOUND);
    if (room.ownerId !== userId) {
      throw new UnauthorizedException('you are not the owner of this room');
    }
    if (roomData.type == 'protected' && !roomData.password) {
      throw new HttpException(
        'missing password for protected room',
        HttpStatus.BAD_REQUEST,
      );
    }
    if (roomData.type == 'protected' && roomData.password) {
      roomData.password = await bcrypt.hash(roomData.password, 10);
    }
    if (roomData.type == 'public' || roomData.type == 'private') {
      roomData.password = null;
    }
    return await this.prisma.room.update({
      where: { id: roomId },
      data: roomData,
    });
  }
  async changeOwner(roomData: ChangeOwnerDto, userId: string) {
    const { ownerId } = await this.prisma.room.findUnique({
      where: { id: roomData.roomId },
      select: { ownerId: true },
    });
    if (ownerId !== userId)
      throw new UnauthorizedException('You are not the owner of this room');
    const updateRoomOwner = await this.prisma.room.update({
      where: { id: roomData.roomId },
      data: { owner: { connect: { userId: roomData.NewOwnerId } } }
    });
    return { message: 'change roomOwner successfully' };
  } 

}
