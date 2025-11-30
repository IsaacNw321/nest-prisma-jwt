import { Injectable, NotFoundException, ConflictException, InternalServerErrorException } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { User } from "./entities/user.entitie";
import { plainToInstance } from 'class-transformer';
import { CreateUserDto } from "./dto/createUser.dto";
import { UpdateUserDto } from "./dto/updateUser.dto";
import { Prisma } from "generated/prisma";

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) { }

  async getAllUsers(): Promise<User[]> {
    try {
      const prismaUsers = await this.prisma.user.findMany();
      return plainToInstance(User, prismaUsers);
    } catch (error) {
      throw new InternalServerErrorException('Failed to fetch users');
    }
  }

  async getUserById(id: string): Promise<User> {
    try {
      const prismaUser = await this.prisma.user.findUnique({
        where: { id }
      });
      if (!prismaUser) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      return plainToInstance(User, prismaUser);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(`Failed to fetch user with ID ${id}`);
    }
  }

  async getUserByEmail(email: string): Promise<User> {
    try {
      const prismaUser = await this.prisma.user.findUnique({
        where: { email },
      });
      if (!prismaUser) {
        throw new NotFoundException(`User with email ${email} not found`);
      }
      return plainToInstance(User, prismaUser);
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      throw new InternalServerErrorException(`Failed to fetch user with email ${email}`);
    }
  }

 async createUser(data: CreateUserDto): Promise<User | null> {
  const MAX_USERS = 50;
  try {
    const result = await this.prisma.$transaction(async (tx) => {
      const userCount = await tx.user.count();
      if (userCount >= MAX_USERS) {
        throw { message: "Too much users", code: "MAX_USERS_EXCEEDED" };
      }
      const prismaUser = await tx.user.create({
        data,
      });
      return plainToInstance(User, prismaUser);
    });
    return result; 
  } catch (error) {
    if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'MAX_USERS_EXCEEDED') {
      return null; 
    }
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      throw new ConflictException('User with this email already exists');
    }
    throw new InternalServerErrorException('Failed to create user');
  }
}

  async updateUser(id: string, data: UpdateUserDto): Promise<User> {
    try {
      const prismaUser = await this.prisma.user.update({
        where: { id },
        data
      });
      return plainToInstance(User, prismaUser);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`User with ID ${id} not found`);
        }
        if (error.code === 'P2002') {
          throw new ConflictException('Email already in use');
        }
      }
      throw new InternalServerErrorException(`Failed to update user with ID ${id}`);
    }
  }

  async deleteUser(id: string): Promise<User> {
    try {
      const prismaUser = await this.prisma.user.delete({
        where: { id },
      });
      return plainToInstance(User, prismaUser);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      throw new InternalServerErrorException(`Failed to delete user with ID ${id}`);
    }
  }
}