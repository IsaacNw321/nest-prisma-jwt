import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Message } from './entities/message.entity';
import { plainToInstance } from 'class-transformer';
import { Prisma } from 'generated/prisma';

@Injectable()
export class MessagesService {
  constructor(private prisma: PrismaService) { }

  async findAll(): Promise<Message[]> {
    try {
      const prismaMessages = await this.prisma.message.findMany()
      return plainToInstance(Message, prismaMessages);
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch messages');
    }
  }

  async create(data: CreateMessageDto): Promise<Message> {
    try {
      const newMessage = await this.prisma.message.create({
        data
      })
      return plainToInstance(Message, newMessage);
    } catch (error) {
      throw new InternalServerErrorException('Failed to create message');
    }
  }

  async update(id: string, data: UpdateMessageDto) {
    try {
      const prismaMessage = await this.prisma.message.update({
        where: { id },
        data
      })
      return plainToInstance(Message, prismaMessage);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException(`Message with ID ${id} not found`);
      }
      throw new InternalServerErrorException(`Failed to update message with ID ${id}`);
    }
  }

  async deleteMessage(id: string): Promise<Message> {
    try {
      const prismaMessage = await this.prisma.message.delete({
        where: { id },
      });
      return plainToInstance(Message, prismaMessage);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException(`Message with ID ${id} not found`);
      }
      throw new InternalServerErrorException(`Failed to delete message with ID ${id}`);
    }
  }
}
