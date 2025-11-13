import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ChatsService } from './chats.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { NotFoundException } from '@nestjs/common';

@Controller('chats')
export class ChatsController {
  constructor(private readonly chatsService: ChatsService) {}

@Get('find')
  async findChatByUsers(
    @Query('user1') user1Id: string, 
    @Query('user2') user2Id: string
  ) {
    if (!user1Id || !user2Id) {
      throw new NotFoundException('Both user1 and user2 IDs must be provided.');
    }
    const chat = await this.chatsService.findChatByUsers(user1Id, user2Id);
    if (!chat) {
        throw new NotFoundException('Chat between these two users not found.');
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
