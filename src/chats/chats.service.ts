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
     const prismaChats = await this.prisma.chat.findMany({
      include : {
        users : true
      }
     });
    return plainToInstance(Chat, prismaChats);
  }
async create(data: CreateChatDto): Promise<Chat | null> {
    try {
        const { userIds } = data; 
        const connectUsers = userIds.map(id => ({ id }));
        const prismaChat = await this.prisma.chat.create({
            data: {
                users: {
                    connect: connectUsers 
                },
            },
            include: {
                users: {
                    select: { id: true, userName: true, email: true } 
                }
            }
        });  
        if (userIds.length < 2) {
            throw new Error("A chat must have at least two users.");
        }
        return plainToInstance(Chat, prismaChat);
    } catch (error) {
        console.error("Error creating chat:", error); 
        return null;
    }
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
async findChatByUsers(userIds: string[]): Promise<Chat | null> {
    const sortedUserIds = [...userIds].sort(); 
    const allUsersPresentCondition = sortedUserIds.map(id => ({
        users: { some: { id: id } }
    }));
    const noExtraUsersCondition = {
        users: {
            none: {
                id: {
                    notIn: sortedUserIds,
                }
            }
        }
    };
    const prismaChat = await this.prisma.chat.findFirst({
        where: {
            AND: [
                ...allUsersPresentCondition,
                noExtraUsersCondition,      
            ]
        },
        include: {
            users: { select: { id: true } }
        }
    });

    if (!prismaChat) {
        return null;
    }
    if (prismaChat.users.length !== userIds.length) {
        return null;
    }
    return plainToInstance(Chat, prismaChat);
}

}
