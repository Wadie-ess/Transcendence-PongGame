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
import { RoomSearchDto } from './dto/room-search.dto';
import * as bcrypt from 'bcrypt';
import { UpdateRoomDto } from './dto/update-room.dto';
import { RoomDataDto } from './dto/room-data.dto';

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

    const room = await this.prisma.room.create({
      data: {
        ...roomData,
        owner: {
          connect: { userId: roomOwnerId },
        },
      },
    });
    await this.prisma.roomMember.create({
      data: {
        user: {
          connect: { userId: roomOwnerId },
        },
        room: {
          connect: { id: room.id },
        },
        is_admin: true,
      },
    });
    return new RoomDataDto(room);
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
    await this.prisma.roomMember.delete({
      where: {
        unique_user_room: {
          userId,
          roomId: memberData.roomId,
        },
      },
    });
    return { message: 'left room successfully' };
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
    const room_updated = await this.prisma.room.update({
      where: { id: roomId },
      data: roomData,
    });
    return new RoomDataDto(room_updated);
  }

  async changeOwner(roomData: ChangeOwnerDto, userId: string) {
    const room = await this.prisma.room.findUnique({
      where: { id: roomData.roomId },
      select: {
        ownerId: true,
        members: {
          where: {
            userId: roomData.memberId,
          },
        },
      },
    });
    //NOTE: test the members
    const member = await this.prisma.roomMember.findUnique({
      where: {
        unique_user_room: {
          userId: roomData.memberId,
          roomId: roomData.roomId,
        },
      },
      select: { id: true },
    });
    if (room.ownerId !== userId)
      throw new UnauthorizedException('You are not the owner of this room');
    if (!member)
      throw new UnauthorizedException('new owner is not a member of this room');
    await this.prisma.room.update({
      where: { id: roomData.roomId },
      data: { owner: { connect: { userId: roomData.memberId } } },
    });
    await this.prisma.roomMember.update({
      where: { id: roomData.memberId },
      data: { is_admin: true },
    });
    return { message: 'roomOwner changed successfully' };
  }

  async setAdmin(roomData: ChangeOwnerDto, userId: string) {
    const room = await this.prisma.room.findUnique({
      where: { id: roomData.roomId },
      select: { ownerId: true },
    });
    const user = await this.prisma.roomMember.findUnique({
      where: {
        unique_user_room: {
          userId: roomData.memberId,
          roomId: roomData.roomId,
        },
      },
      select: { is_admin: true },
    });
    if (!room) throw new HttpException('room not found', HttpStatus.NOT_FOUND);
    if (room.ownerId !== userId)
      throw new UnauthorizedException('You are not the owner of this room');
    if (!user)
      throw new UnauthorizedException('new admin is not a member of this room');
    if (user.is_admin || room.ownerId === roomData.memberId)
      throw new UnauthorizedException(
        'new admin is already an admin of this room',
      );
    return await this.prisma.roomMember.update({
      where: {
        unique_user_room: {
          userId: roomData.memberId,
          roomId: roomData.roomId,
        },
      },
      data: { is_admin: true },
    });
  }

  async kickMember(roomData: ChangeOwnerDto, userId: string) {
    const room = await this.prisma.room.findUnique({
      where: { id: roomData.roomId },
      select: { ownerId: true },
    });
    const user = await this.prisma.roomMember.findUnique({
      where: { unique_user_room: { userId: userId, roomId: roomData.roomId } },
      select: { is_admin: true },
    });
    const member = await this.prisma.roomMember.findUnique({
      where: {
        unique_user_room: {
          userId: roomData.memberId,
          roomId: roomData.roomId,
        },
      },
    });
    if (!room) throw new HttpException('room not found', HttpStatus.NOT_FOUND);
    if (!member)
      throw new HttpException('member not found', HttpStatus.NOT_FOUND);
    if (room.ownerId !== userId || !user.is_admin)
      throw new UnauthorizedException(
        'You are not owner or admin of this room',
      );
    if (member.userId === room.ownerId)
      throw new UnauthorizedException(
        'You can not kick the owner of this room',
      );
    if (member.userId === userId)
      throw new UnauthorizedException('You can not kick yourself');
    return await this.prisma.roomMember.delete({
      where: {
        unique_user_room: {
          userId: roomData.memberId,
          roomId: roomData.roomId,
        },
      },
    });
  }

  async muteMember(roomData: ChangeOwnerDto, userId: string) {
    const room = await this.prisma.room.findUnique({
      where: { id: roomData.roomId },
      select: { ownerId: true },
    });
    const user = await this.prisma.roomMember.findUnique({
      where: { unique_user_room: { userId: userId, roomId: roomData.roomId } },
      select: { is_admin: true },
    });
    const member = await this.prisma.roomMember.findUnique({
      where: {
        unique_user_room: {
          userId: roomData.memberId,
          roomId: roomData.roomId,
        },
      },
    });
    if (!room) throw new HttpException('room not found', HttpStatus.NOT_FOUND);
    if (!member)
      throw new HttpException('member not found', HttpStatus.NOT_FOUND);
    if (!user.is_admin)
      throw new UnauthorizedException('You are not admin of this room');
    if (member.is_mueted)
      throw new UnauthorizedException('member is already muted');
    if (member.userId === userId)
      throw new UnauthorizedException('You can not mute yourself');
    const afterFiveMin = new Date(Date.now() + 5 * 60 * 1000);
    await this.prisma.roomMember.update({
      where: {
        unique_user_room: {
          userId: roomData.memberId,
          roomId: roomData.roomId,
        },
      },
      data: { is_mueted: true, mute_expires: afterFiveMin },
    });
  }

  async getRooms(query: RoomSearchDto) {
    const rooms = await this.prisma.room.findMany({
      where: {
        name: {
          contains: query.q,
          mode: 'insensitive',
        },
        type: {
          not: 'private',
        },
      },
    });
    return rooms.map((room) => {
      return { id: room.id, name: room.name, type: room.type };
    });
  }

  async getRoomMembers(
    roomId: string,
    userId: string,
    offset: number,
    limit: number,
  ) {
    const user = await this.prisma.roomMember.findUnique({
      where: { unique_user_room: { userId: userId, roomId: roomId } },
    });

    if (!user)
      throw new UnauthorizedException('You are not a member of this room');

    return await this.prisma.roomMember.findMany({
      skip: offset,
      take: limit,
      where: {
        roomId: roomId,
        is_banned: false,
      },
      select: {
        user: {
          select: {
            userId: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }
}
