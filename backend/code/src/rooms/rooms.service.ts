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
import { PICTURE } from 'src/profile/dto/profile.dto';
import { DMsData } from './types/room-dms-type';
import { roomsData } from './types/room-types';

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
    if (roomData.type === 'dm' && !('secondMember' in roomData)) {
      throw new HttpException('something went wrong', HttpStatus.BAD_REQUEST);
    }

    const secondMember: string | undefined = roomData.secondMember;
    delete roomData.secondMember;

    if (roomData.type === 'dm') {
      if (roomOwnerId === secondMember) {
        throw new HttpException(
          'you cannot create a dm room with yourself',
          HttpStatus.BAD_REQUEST,
        );
      }
      const user = await this.prisma.user.findUnique({
        where: {
          userId: secondMember,
        },
      });
      if (!user) {
        throw new HttpException('user not found', HttpStatus.NOT_FOUND);
      }
      const friendshipId = [roomOwnerId, secondMember].sort().join('-');
      const blocked = await this.prisma.blockedUsers.findUnique({
        where: {
          id: friendshipId,
        },
      });
      if (blocked) {
        throw new HttpException(
          'an error occured while creating the dm room',
          HttpStatus.FORBIDDEN,
        );
      }
      // check if already there is an existing dm room
      const dmRoom = await this.prisma.room.findFirst({
        where: {
          type: 'dm',
          members: {
            every: {
              userId: {
                in: [roomOwnerId, secondMember],
              },
            },
          },
        },
      });
      if (dmRoom) {
        return new RoomDataDto(dmRoom);
      }
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

    if (roomData.type === 'dm') {
      await this.prisma.roomMember.create({
        data: {
          user: {
            connect: { userId: secondMember },
          },
          room: {
            connect: { id: room.id },
          },
          is_admin: true,
        },
      });
    }

    return new RoomDataDto(room);
  }

  async joinRoom(roomData: JoinRoomDto, userId: string) {
    const room = await this.prisma.room.findUnique({
      where: { id: roomData.roomId },
      select: { type: true, password: true },
    });

    const count = await this.prisma.roomMember.aggregate({
      where: {
        roomId: roomData.roomId,
      },
      _count: {
        userId: true,
      },
    });

    if (count._count.userId > 20)
      throw new HttpException('Room is full', HttpStatus.BAD_REQUEST);
    if (!room) throw new HttpException('room not found', HttpStatus.NOT_FOUND);
    if (room.type === 'protected' && !('password' in roomData))
      throw new HttpException(
        'missing password for protected room',
        HttpStatus.BAD_REQUEST,
      );
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
    const newOwner = await this.prisma.roomMember.findFirst({
      where: {
        roomId: memberData.roomId,
        is_admin: true,
        NOT: {
          userId: ownerId,
        },
      },
      select: {
        userId: true,
      },
    });
    if (ownerId === userId && !newOwner)
      throw new UnauthorizedException(
        'You cannot leave this room because you are the only admin in it',
      );

    if (ownerId === userId && newOwner) {
      await this.prisma.room.update({
        where: { id: memberData.roomId },
        data: { owner: { connect: { userId: newOwner.userId } } },
      });
    }
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
      select: { ownerId: true, type: true },
    });

    if (room.type == 'dm')
      throw new HttpException(
        'dm room can not be updated',
        HttpStatus.BAD_REQUEST,
      );

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
      throw new UnauthorizedException('user is not a member of this room');
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
      throw new UnauthorizedException('user is not a member of this room');
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
    if (!user.is_admin || user.is_banned)
      throw new UnauthorizedException('You are not admin of this room');
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
      select: {
        ownerId: true,
        members: {
          where: {
            OR: [
              {
                userId: roomData.memberId,
              },
              {
                userId: userId,
              },
            ],
          },
        },
      },
    });
    //NOTE: check members content
    const user = await this.prisma.roomMember.findUnique({
      where: { unique_user_room: { userId: userId, roomId: roomData.roomId } },
    });
    const member = await this.prisma.roomMember.findUnique({
      where: {
        unique_user_room: {
          userId: roomData.memberId,
          roomId: roomData.roomId,
        },
      },
      select: {
        room: true,
        is_mueted: true,
        userId: true,
      },
    });
    if (!room) throw new HttpException('room not found', HttpStatus.NOT_FOUND);
    if (!member)
      throw new HttpException('member not found', HttpStatus.NOT_FOUND);
    if (!user.is_admin || user.is_banned)
      throw new UnauthorizedException('You are not admin of this room');
    if (member.is_mueted)
      throw new UnauthorizedException('member is already muted');
    if (member.room.ownerId === roomData.memberId)
      throw new UnauthorizedException('You cannot mute the owner');
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
    const members = await this.prisma.roomMember.findMany({
      skip: offset,
      take: limit,
      where: {
        roomId: roomId,
      },
      select: {
        user: {
          select: {
            userId: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
        is_banned: true,
        is_mueted: true,
      },
    });
    const filtredmembers = members.filter(
      (member) => !member.is_banned || user.is_admin,
    );
    return filtredmembers.map((member) => {
      if (!member.is_banned || user.is_admin) {
        const avatar: PICTURE = {
          thumbnail: `https://res.cloudinary.com/trandandan/image/upload/c_thumb,h_48,w_48/${member.user.avatar}`,
          medium: `https://res.cloudinary.com/trandandan/image/upload/c_thumb,h_72,w_72/${member.user.avatar}`,
          large: `https://res.cloudinary.com/trandandan/image/upload/c_thumb,h_128,w_128/${member.user.avatar}`,
        };
        return {
          id: member.user.userId,
          firstname: member.user.firstName,
          lastname: member.user.lastName,
          avatar: avatar,
          isBaned: member.is_banned,
          isMuted: member.is_mueted,
        };
      }
    });
  }
  async banMember(memberData: ChangeOwnerDto, userId: string) {
    const user = await this.prisma.roomMember.findUnique({
      where: {
        unique_user_room: { userId: userId, roomId: memberData.roomId },
      },
    });
    const { ownerId } = await this.prisma.room.findUnique({
      where: { id: memberData.roomId },
    });

    if (!user || !user.is_admin || user.is_banned)
      throw new UnauthorizedException('You are not the admin of this Room');
    if (userId == memberData.memberId)
      throw new UnauthorizedException('You cannot ban yourself');
    if (ownerId == memberData.memberId)
      throw new UnauthorizedException('You cannot ban the Owner of this Room');
    await this.prisma.roomMember.update({
      where: {
        unique_user_room: {
          userId: memberData.memberId,
          roomId: memberData.roomId,
        },
      },
      data: {
        is_banned: true,
        bannedAt: new Date(Date.now()),
      },
    });
    return { message: 'member banned successfully' };
  }

  async unbanMember(memberData: ChangeOwnerDto, userId: string) {
    const user = await this.prisma.roomMember.findUnique({
      where: {
        unique_user_room: { userId: userId, roomId: memberData.roomId },
      },
    });
    const member = await this.prisma.roomMember.findUnique({
      where: {
        unique_user_room: {
          userId: memberData.memberId,
          roomId: memberData.roomId,
        },
      },
    });
    if (!member)
      throw new HttpException('user not found', HttpStatus.NOT_FOUND);
    if (!member.is_banned)
      throw new HttpException('member is not banned', HttpStatus.BAD_REQUEST);
    if (!user.is_admin)
      throw new UnauthorizedException('You are not admin of this room');
    await this.prisma.roomMember.update({
      where: {
        unique_user_room: {
          userId: memberData.memberId,
          roomId: memberData.roomId,
        },
      },
      data: {
        is_banned: false,
      },
    });
    return { message: 'member unbanned successfully' };
  }

  async addMember(memberData: ChangeOwnerDto, userId: string) {
    const user = await this.prisma.roomMember.findUnique({
      where: {
        unique_user_room: { userId: userId, roomId: memberData.roomId },
      },
    });

    const member = await this.prisma.roomMember.findUnique({
      where: {
        unique_user_room: {
          userId: memberData.memberId,
          roomId: memberData.roomId,
        },
      },
    });

    const count = await this.prisma.roomMember.aggregate({
      where: {
        roomId: memberData.roomId,
      },
      _count: {
        userId: true,
      },
    });

    if (count._count.userId >= 20)
      throw new HttpException('Room is full', HttpStatus.BAD_REQUEST);
    if (!user || !user.is_admin || user.is_banned)
      throw new UnauthorizedException('You are not the admin of this Room');
    if (member) throw new UnauthorizedException('User already Exist');
    await this.prisma.roomMember.create({
      data: {
        user: {
          connect: { userId: memberData.memberId },
        },
        room: {
          connect: { id: memberData.roomId },
        },
      },
    });
    return { message: 'User added successfully' };
  }

  async listRooms(
    userId: string,
    offset: number,
    limit: number,
    joined: boolean,
  ) {
    const rooms = await this.prisma.room.findMany({
      skip: offset,
      take: limit,
      where: {
        ...(joined && {
          members: { some: { userId: userId } },
          NOT: { type: 'dm' },
        }),
        ...(!joined && { OR: [{ type: 'public' }, { type: 'protected' }] }),
      },
      select: {
        id: true,
        name: true,
        type: true,
        ownerId: true,
        ...(joined && {
          members: {
            where: {
              userId: userId,
            },
            select: {
              is_admin: true,
              is_banned: true,
              bannedAt: true,
            },
          },
        }),
      },
    });
    if (!joined) return rooms;

    const roomsData: roomsData[] = await Promise.all(
      rooms.map(async (room) => {
        const countMembers = await this.prisma.roomMember.count({
          where: {
            roomId: room.id,
          },
        });

        const last_message = await this.prisma.message.findFirst({
          where: {
            roomId: room.id,
            ...(room.members[0].is_banned && {
              createdAt: { lte: room.members[0].bannedAt },
            }),
          },
          orderBy: {
            createdAt: 'desc',
          },
          select: {
            content: true,
            createdAt: true,
            authorId: true,
          },
        });
        const blocked = await this.prisma.blockedUsers.findFirst({
          where: {
            id: [userId, last_message.authorId].sort().join('-'),
          },
        });

        const is_owner = room.ownerId === userId;
        return {
          id: room.id,
          name: room.name,
          type: room.type,
          is_admin: room.members[0].is_admin,
          is_owner,
          countMembers,
          last_message: blocked ? null : last_message,
        };
      }),
    );
    return roomsData;
  }

  async getDMs(userId: string, offset: number, limit: number) {
    const rooms = await this.prisma.room.findMany({
      skip: offset,
      take: limit,
      where: {
        type: 'dm',
        members: {
          some: {
            userId: userId,
          },
        },
      },
      select: {
        id: true,
        type: true,
        ownerId: true,
        members: {
          select: {
            user: {
              select: {
                userId: true,
                firstName: true,
                lastName: true,
                avatar: true,
                discreption: true,
              },
            },
          },
        },
      },
    });

    const dmsData: DMsData[] = await Promise.all(
      rooms.map(async (room) => {
        const secondMember = room.members.find(
          (member) => member.user.userId !== userId,
        );
        const last_message = await this.prisma.message.findFirst({
          where: {
            roomId: room.id,
          },
          orderBy: {
            createdAt: 'desc',
          },
          select: {
            content: true,
            createdAt: true,
          },
        });
        const blocked = await this.prisma.blockedUsers.findFirst({
          where: {
            id: [userId, secondMember.user.userId].sort().join('-'),
          },
        });

        const avatar: PICTURE = {
          thumbnail: `https://res.cloudinary.com/trandandan/image/upload/c_thumb,h_48,w_48/${secondMember.user.avatar}`,
          medium: `https://res.cloudinary.com/trandandan/image/upload/c_thumb,h_72,w_72/${secondMember.user.avatar}`,
          large: `https://res.cloudinary.com/trandandan/image/upload/c_thumb,h_128,w_128/${secondMember.user.avatar}`,
        };
        return {
          id: room.id,
          name: secondMember.user.firstName + ' ' + secondMember.user.lastName,
          secondMemberId: secondMember.user.userId,
          last_message: blocked ? null : last_message,
          avatar,
          bio: secondMember.user.discreption,
        };
      }),
    );
    return dmsData;
  }

  async getDM(userId: string, dmId: string) {
    const room = await this.prisma.room.findUnique({
      where: {
        id: dmId,
      },
      select: {
        id: true,
        type: true,
        ownerId: true,
        members: {
          select: {
            user: {
              select: {
                userId: true,
                firstName: true,
                lastName: true,
                avatar: true,
                discreption: true,
              },
            },
          },
        },
      },
    });
    if (!room) throw new HttpException('room not found', HttpStatus.NOT_FOUND);
    const member = room.members.find((member) => member.user.userId === userId);
    if (!member)
      throw new UnauthorizedException('you are not a member of this room');
    const secondMember = room.members.find(
      (member) => member.user.userId !== userId,
    );

    const avatar: PICTURE = {
      thumbnail: `https://res.cloudinary.com/trandandan/image/upload/c_thumb,h_48,w_48/${secondMember.user.avatar}`,
      medium: `https://res.cloudinary.com/trandandan/image/upload/c_thumb,h_72,w_72/${secondMember.user.avatar}`,
      large: `https://res.cloudinary.com/trandandan/image/upload/c_thumb,h_128,w_128/${secondMember.user.avatar}`,
    };
    return {
      id: room.id,
      name: secondMember.user.firstName + ' ' + secondMember.user.lastName,
      secondMemberId: secondMember.user.userId,
      avatar,
      bio: secondMember.user.discreption,
    };
  }
}
