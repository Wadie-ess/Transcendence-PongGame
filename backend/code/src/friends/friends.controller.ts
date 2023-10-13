import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { FriendsService } from './friends.service';
import { AtGuard } from 'src/auth/guards/at.guard';
import { FriendDto } from './dto/add-friend.dto';
import { GetCurrentUser } from 'src/auth/decorator/get_current_user.decorator';
import {
  ApiCookieAuth,
  ApiProperty,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FriendResponseDto } from './dto/frined-response.dto';
import { QueryOffsetDto } from './dto/query-ofsset-dto';

class ListType {
  @ApiProperty({ example: '60f1a7b0e1b3c2a4e8b4a1a0' })
  userId: string;
  firstName: string;
  lastName: string;
}

@ApiTags('friends')
@ApiCookieAuth('X-Acces-Token')
@Controller('friends')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @Post('add')
  @ApiResponse(
    {
      type: FriendResponseDto,
      schema: {
        example: {
          accepted: false,
        },
      },
      status: HttpStatus.CREATED,
    },
    { overrideExisting: true },
  )
  @UseGuards(AtGuard)
  async addFriend(
    @Body() addFriendDto: FriendDto,
    @GetCurrentUser('userId') userId: string,
  ) {
    return this.friendsService.addFriend(userId, addFriendDto.friendId);
  }

  @Post('accept')
  @ApiResponse({
    type: FriendResponseDto,
    schema: {
      example: {
        accepted: true,
      },
    },
    status: HttpStatus.OK,
  })
  @HttpCode(HttpStatus.OK)
  @UseGuards(AtGuard)
  async acceptFriend(
    @Body() addFriendDto: FriendDto,
    @GetCurrentUser('userId') userId: string,
  ) {
    return this.friendsService.acceptFriend(userId, addFriendDto.friendId);
  }

  @Post('block')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AtGuard)
  async blockFriend(
    @Body() addFriendDto: FriendDto,
    @GetCurrentUser('userId') userId: string,
  ) {
    return this.friendsService.blockFriend(userId, addFriendDto.friendId);
  }

  @Post('unblock')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AtGuard)
  async unblockFriend(
    @Body() addFriendDto: FriendDto,
    @GetCurrentUser('userId') userId: string,
  ) {
    return this.friendsService.unblockFriend(userId, addFriendDto.friendId);
  }

  @Post(['reject', 'unfriend'])
  @HttpCode(HttpStatus.OK)
  @UseGuards(AtGuard)
  async rejectFriend(
    @Body() addFriendDto: FriendDto,
    @GetCurrentUser('userId') userId: string,
  ) {
    return this.friendsService.rejectFriend(userId, addFriendDto.friendId);
  }

  @Get('list')
  @UseGuards(AtGuard)
  @ApiQuery({ name: 'offset', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ type: ListType })
  async getFriendsList(
    @GetCurrentUser('userId') userId: string,
    @Query() { offset, limit }: QueryOffsetDto,
  ) {
    return this.friendsService.getFriendsList(userId, offset, limit);
  }

  @Get('requests')
  @UseGuards(AtGuard)
  @ApiQuery({ name: 'offset', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getFriendsRequests(
    @GetCurrentUser('userId') userId: string,
    @Query() { offset, limit }: QueryOffsetDto,
  ) {
    return this.friendsService.getFriendsRequests(userId, offset, limit);
  }

  @Get('blocklist')
  @UseGuards(AtGuard)
  async getBlockList(
    @GetCurrentUser('userId') userId: string,
    @Query() { offset, limit }: QueryOffsetDto,
  ) {
    return this.friendsService.getBlockList(userId, offset, limit);
  }

  @Get('pending')
  @UseGuards(AtGuard)
  async getFriendsPending(
    @GetCurrentUser('userId') userId: string,
    @Query() { offset, limit }: QueryOffsetDto,
  ) {
    return this.friendsService.getPendingRequests(userId, offset, limit);
  }
}
