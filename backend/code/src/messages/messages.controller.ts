import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MessagesService } from './messages.service';
import { CreateMessgaeDto } from './dto/create-messgae.dto';
import { GetCurrentUser } from 'src/auth/decorator/get_current_user.decorator';
import { AtGuard } from 'src/auth/guards/at.guard';
import { ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { MessageFormatDto } from './dto/message-format.dto';
import { QueryOffsetDto } from 'src/friends/dto/query-ofsset-dto';

@ApiTags('Messages')
@Controller('messages')
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @ApiResponse({ type: MessageFormatDto })
  @ApiParam({
    description: 'roomId',
    name: 'id',
    example: 'clnx17wal00003b6leivni4oe',
  })
  @Post('room/:id')
  @UseGuards(AtGuard)
  sendMessages(
    @Param('id') channelId: string,
    @Body() messageDto: CreateMessgaeDto,
    @GetCurrentUser('userId') userId: string,
  ) {
    return this.messagesService.sendMessages(userId, channelId, messageDto);
  }

  @ApiResponse({ type: MessageFormatDto, isArray: true })
  @Get('room/:id')
  @UseGuards(AtGuard)
  getMessages(
    @Param('id') channelId: string,
    @Query() { offset, limit }: QueryOffsetDto,
    @GetCurrentUser('userId') userId: string,
  ) {
    return this.messagesService.getMessages(userId, channelId, offset, limit);
  }
}
