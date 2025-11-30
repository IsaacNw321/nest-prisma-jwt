import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { PrismaService } from "src/prisma/prisma.service";
import { Chat } from './entities/chat.entity';
import { plainToInstance } from 'class-transformer';
import { Prisma } from 'generated/prisma';

@Injectable()
export class ChatsService {
    constructor(private prisma: PrismaService) { }

    async findAll(): Promise<Chat[]> {
        try {
            const prismaChats = await this.prisma.chat.findMany({
                include: {
                    users: true,
                    messages : true
                }
            });
            return plainToInstance(Chat, prismaChats);
        } catch (error) {
            throw new InternalServerErrorException('Failed to fetch chats');
        }
    }

    async create(data: CreateChatDto): Promise<Chat> {
        try {
            const { userIds } = data;
            if (userIds.length < 2) {
                throw new BadRequestException("A chat must have at least two users.");
            }
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
            return plainToInstance(Chat, prismaChat);
        } catch (error) {
            if (error instanceof BadRequestException) throw error;
            throw new InternalServerErrorException('Failed to create chat');
        }
    }

    async getChatById(id: string): Promise<Chat> {
        try {
            const prismaChat = await this.prisma.chat.findUnique({
                where: { id },
                include: {
                    messages: true,
                    users: {
                        select: { id: true, userName: true }
                    }
                }
            });

            if (!prismaChat) {
                throw new NotFoundException(`Chat with ID ${id} not found`);
            }
            return plainToInstance(Chat, prismaChat);
        } catch (error) {
            if (error instanceof NotFoundException) throw error;
            throw new InternalServerErrorException(`Failed to fetch chat with ID ${id}`);
        }
    }

    async update(id: string, data: UpdateChatDto) {
        try {
            const prismaChat = await this.prisma.chat.update({
                where: { id },
                data
            });
            return plainToInstance(Chat, prismaChat);
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                throw new NotFoundException(`Chat with ID ${id} not found`);
            }
            throw new InternalServerErrorException(`Failed to update chat with ID ${id}`);
        }
    }

    async remove(id: string) {
        try {
            const prismaChat = await this.prisma.chat.delete({
                where: { id }
            });
            return plainToInstance(Chat, prismaChat);
        } catch (error) {
            if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
                throw new NotFoundException(`Chat with ID ${id} not found`);
            }
            throw new InternalServerErrorException(`Failed to delete chat with ID ${id}`);
        }
    }

    async findChatByUsers(userIds: string[]): Promise<Chat> {
        try {
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
                    users: { select: { id: true, userName: true } }
                }
            });
            if (!prismaChat) {
                throw new NotFoundException('Chat with these users not found');
            }
            if (prismaChat.users.length !== userIds.length) {
                throw new NotFoundException('Chat with exact users not found');
            }
            return plainToInstance(Chat, prismaChat);
        } catch (error) {
            if (error instanceof NotFoundException) throw error;
            throw new InternalServerErrorException('Failed to find chat by users');
        }
    }
}
