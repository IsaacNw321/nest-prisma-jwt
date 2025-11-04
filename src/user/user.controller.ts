import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from "@nestjs/common";
import { UserService } from "./user.service";
import { AuthGuard } from "@nestjs/passport";
import { User } from "generated/prisma";
@Controller("users")
export class UserController {
  constructor(private readonly userService : UserService) {}

  @Get()
  async getAllUsers(){
    return this.userService.getAllUsers()
  }

  @Post()
  async createTask(@Body() data : User){
    return this.userService.createUser(data)
  }
  @UseGuards(AuthGuard('jwt'))
  @Get(":id")
  async getUserById(@Param("id") id: string){
    return this.userService.getUserById(id)
  }
  @UseGuards(AuthGuard('jwt'))
  @Delete(":id")
  async deleteUser(@Param("id") id: string){
    return this.userService.deleteUser(id)
  }
  @UseGuards(AuthGuard('jwt'))
  @Put(":id")
  async updateUser(@Param("id") id: string, @Body() data : User){
    return this.userService.updateUser(id, data)
  }
}