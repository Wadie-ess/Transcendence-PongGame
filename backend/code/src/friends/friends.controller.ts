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
import { ApiCookieAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { FriendResponseDto } from './dto/frined-response.dto';
import { QueryOffsetDto } from './dto/query-ofsset-dto';
import { FriendProfileDto } from './dto/friend-profile.dto';

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
  @ApiResponse({ type: FriendProfileDto })
  async getFriendsList(@GetCurrentUser('userId') userId: string) {
    return this.friendsService.getFriendsList(userId);
  }

  @Get('requests')
  @UseGuards(AtGuard)
  @ApiResponse({ type: FriendProfileDto })
  async getFriendsRequests(
    @GetCurrentUser('userId') userId: string,
    @Query() { offset, limit }: QueryOffsetDto,
  ) {
    return this.friendsService.getFriendsRequests(userId, offset, limit);
  }

  @Get('blocklist')
  @UseGuards(AtGuard)
  @ApiResponse({ type: FriendProfileDto })
  async getBlockList(@GetCurrentUser('userId') userId: string) {
    return this.friendsService.getBlockList(userId);
  }

  @Get('pending')
  @UseGuards(AtGuard)
  @ApiResponse({ type: FriendProfileDto })
  async getFriendsPending(
    @GetCurrentUser('userId') userId: string,
    @Query() { offset, limit }: QueryOffsetDto,
  ) {
    return this.friendsService.getPendingRequests(userId, offset, limit);
  }
}
