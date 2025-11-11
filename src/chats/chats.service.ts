import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { PrismaService } from "src/prisma/prisma.service";
import { Chat } from './entities/chat.entity';
import { plainToInstance } from 'class-transformer';
@Injectable()
export class ChatsService {
  constructor(private prisma : PrismaService) {}
  async findAll(): Promise<Chat[]> {
     const prismaChats = await this.prisma.chat.findMany();
    return plainToInstance(Chat, prismaChats);
  }
  async create(data :  CreateChatDto): Promise<Chat>  {
    const prismaChat = await this.prisma.chat.create({
      data
    });
    return plainToInstance(Chat, prismaChat);
  }


  async getChatById(id: string): Promise<Chat | null> {
      const prismChat = await this.prisma.user.findUnique({
        where: {
          id: id
        }
      });
      if (!prismChat) {
        return null;
      }
      return plainToInstance(Chat, prismChat);
    }

  update(id: string, data : UpdateChatDto) {
    return this.prisma.chat.update({
      where : {
        id,
      },
      data 
    });
  }

  remove(id: string) {
    return this.prisma.chat.delete({
      where : {
        id,
      }
    });
  }
}
