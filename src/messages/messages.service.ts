import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Message } from './entities/message.entity';
import { plainToInstance } from 'class-transformer';
@Injectable()
export class MessagesService {
  constructor(private prisma : PrismaService){}
  
  async findAll(): Promise<Message[]> {
    const prismaMessages = await this.prisma.message.findMany()
    return plainToInstance(Message, prismaMessages);
  }
  async create(data : CreateMessageDto): Promise<Message>{
    const newMessage = await this.prisma.message.create({
      data
    })
    return plainToInstance(Message, newMessage);
  }

  async update(id: string, data : UpdateMessageDto) {
    const prismaMessage = await this.prisma.message.update({
      where : {
        id,
      },
      data 
    })
       return plainToInstance(Message, prismaMessage);
  }

 async deleteMessage(id: string): Promise<Message> {
    const prismaMessage = await this.prisma.user.delete({
      where: {
        id
      },
    });
    return plainToInstance(Message, prismaMessage);
  }
}
