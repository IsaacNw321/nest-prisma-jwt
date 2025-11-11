import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { PrismaService } from "src/prisma/prisma.service";
import { Chat} from 'generated/prisma';
@Injectable()
export class ChatsService {
  constructor(private prisma : PrismaService) {}
  create(data :  Chat) {
    return this.prisma.chat.create({
      data
    });
  }

  findAll() {
    return this.prisma.chat.findMany();
  }

  findOne(id: string) {
    return this.prisma.chat.findUnique({
      where : {
        id,
      }
    });
  }

  update(id: string, data : Chat) {
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
