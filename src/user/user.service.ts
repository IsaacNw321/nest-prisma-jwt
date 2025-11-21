import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service"; 
import { User } from "./entities/user.entitie";
import { plainToInstance } from 'class-transformer';
import { CreateUserDto } from "./dto/createUser.dto";
import { UpdateUserDto } from "./dto/updateUser.dto";

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}
  async getAllUsers(): Promise<User[]> {
    const prismaUsers = await this.prisma.user.findMany();
    return plainToInstance(User, prismaUsers);
  }
  async getUserById(id: string): Promise<User | null> {
    const prismaUser = await this.prisma.user.findUnique({
      where: {
        id: id
      }
    });
    if (!prismaUser) {
      return null;
    }
    return plainToInstance(User, prismaUser);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const prismaUser = await this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    if (!prismaUser) {
      return null;
    }
    return plainToInstance(User, prismaUser);
  }
  async createUser(data: CreateUserDto): Promise<User> {
    const prismaUser = await this.prisma.user.create({
      data
    });
    return plainToInstance(User, prismaUser);
  }

  async updateUser(id: string, data: UpdateUserDto): Promise<User> {
    const prismaUser = await this.prisma.user.update({
      where: {
        id
      },
      data
    });
    return plainToInstance(User, prismaUser);
  }

  async deleteUser(id: string): Promise<User> {
    const prismaUser = await this.prisma.user.delete({
      where: {
        id
      },
    });
    return plainToInstance(User, prismaUser);
  }
}