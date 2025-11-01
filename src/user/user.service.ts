import { Injectable } from "@nestjs/common";
import { User } from "generated/prisma";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()

export class UserService {
  constructor(private prisma : PrismaService) {}

  async getAllUsers(): Promise<User[]>{
    return this.prisma.user.findMany();
  }

    async getUserById(id : string): Promise<User | null>{
    return this.prisma.user.findUnique({
      where : {
        id : id
      }
    });
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: {
        email: email,
      },
    });
  }

    async createUser(data: User): Promise<User>{
    return this.prisma.user.create({
      data
    });
  }

    async updateUser(id: string , data : User): Promise<User>{
    return this.prisma.user.update({
      where : {
        id
      },
      data
    });
  }
  
  async deleteUser(id: string): Promise<User>{
    return this.prisma.user.delete({
      where : {
        id
      },
    });
  }
}