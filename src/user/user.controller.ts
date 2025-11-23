import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { User } from "generated/prisma";
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
@Controller("users")
export class UserController {
  constructor(private readonly userService : UserService) {}
  //@UseGuards(JwtAuthGuard)
  @Get()
  async getAllUsers(){
    return this.userService.getAllUsers()
  }

  @Post()
  async createTask(@Body() data : User){
    return this.userService.createUser(data)
  }
  @Get(":id")
  async getUserById(@Param("id") id: string){
    return this.userService.getUserById(id)
  }
   @UseGuards(JwtAuthGuard)
  @Delete(":id")
  async deleteUser(@Param("id") id: string){
    return this.userService.deleteUser(id)
  }
   //@UseGuards(JwtAuthGuard)
  @Put(":id")
  async updateUser(@Param("id") id: string, @Body() data : User){
    return this.userService.updateUser(id, data)
  }
}