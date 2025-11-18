import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { NotFoundException } from '@nestjs/common';
import { Chat } from './entities/chat.entity';
@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

@Get('find')
async findChatByUsers(@Query('userIds') userIds: string | string[]): Promise<Chat | null> {
    const ids = Array.isArray(userIds) ? userIds : [userIds];
    const validIds = ids.filter(id => id && id.length > 0);
    if (validIds.length < 2) {
        throw new NotFoundException('A chat must have at least two user IDs.');
    }
    const chat = await this.chatsService.findChatByUsers(validIds);
    if (!chat) {
        throw new NotFoundException('Chat not found for the specified users.');
    }
    
    return chat;
}
  @Post()
  create(@Body() createChatDto: CreateChatDto) {
    return this.chatsService.create(createChatDto);
  }

  @Get()
  findAll() {
    return this.chatsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chatsService.getChatById(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateChatDto: UpdateChatDto) {
    return this.chatsService.update(id, updateChatDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.chatsService.remove(id);
  }
}
