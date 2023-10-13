import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessgaeDto } from './dto/create-messgae.dto';
import { GetCurrentUser } from 'src/auth/decorator/get_current_user.decorator';
import { AtGuard } from 'src/auth/guards/at.guard';

@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}
  @Post('send/:id')
  @UseGuards(AtGuard)
  sendMessages(
    @Param('id') channelId: string,
    @Body() messageDto: CreateMessgaeDto,
    @GetCurrentUser('userId') userId: string,
  ) {
    return this.messagesService.sendMessages(userId, channelId, messageDto);
  }
}
