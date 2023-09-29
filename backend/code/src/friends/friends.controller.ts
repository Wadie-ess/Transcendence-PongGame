import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { AtGuard } from 'src/auth/guards/at.guard';
import { AddFriendDto } from './dto/add-friend.dto';
import { GetCurrentUser } from 'src/auth/decorator/get_current_user.decorator';

@Controller('friends')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) {}

  @Post('add')
  @UseGuards(AtGuard)
  async addFriend(
    @Body() addFriendDto: AddFriendDto,
    @GetCurrentUser('userId') userId: string,
  ) {
    return this.friendsService.addFriend(userId, addFriendDto.friendId);
  }

  @Post('accept')
  @UseGuards(AtGuard)
  async acceptFriend(
    @Body() addFriendDto: AddFriendDto,
    @GetCurrentUser('userId') userId: string,
  ) {
    return this.friendsService.acceptFriend(userId, addFriendDto.friendId);
  }

  @Post('block')
  @UseGuards(AtGuard)
  async blockFriend(
    @Body() addFriendDto: AddFriendDto,
    @GetCurrentUser('userId') userId: string,
  ) {
    return this.friendsService.blockFriend(userId, addFriendDto.friendId);
  }

  @Post('unblock')
  @UseGuards(AtGuard)
  async unblockFriend(
    @Body() addFriendDto: AddFriendDto,
    @GetCurrentUser('userId') userId: string,
  ) {
    return this.friendsService.unblockFriend(userId, addFriendDto.friendId);
  }

  @Post(['reject', 'unfriend'])
  @UseGuards(AtGuard)
  async rejectFriend(
    @Body() addFriendDto: AddFriendDto,
    @GetCurrentUser('userId') userId: string,
  ) {
    return this.friendsService.rejectFriend(userId, addFriendDto.friendId);
  }

  @Get('list')
  @UseGuards(AtGuard)
  async getFriendsList(@GetCurrentUser('userId') userId: string) {
    return this.friendsService.getFriendsList(userId);
  }

  @Get('requests')
  @UseGuards(AtGuard)
  async getFriendsRequests(@GetCurrentUser('userId') userId: string) {
    return this.friendsService.getFriendsRequests(userId);
  }

  @Get('blocklist')
  @UseGuards(AtGuard)
  async getBlockList(@GetCurrentUser('userId') userId: string) {
    return this.friendsService.getBlockList(userId);
  }

  @Get('pending')
  @UseGuards(AtGuard)
  async getFriendsPending(@GetCurrentUser('userId') userId: string) {
    return this.friendsService.getPendingRequests(userId);
  }
}
