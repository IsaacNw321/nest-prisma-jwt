import { Controller, Get, Post, Put, Delete, Body, Param } from "@nestjs/common";
import { UserService } from "./user.service";
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

  @Get(":id")
  async getUserById(@Param("id") id: string){
    return this.userService.getUserById(id)
  }
  @Delete(":id")
  async deleteUser(@Param("id") id: string){
    return this.userService.deleteUser(id)
  }
  @Put(":id")
  async updateUser(@Param("id") id: string, @Body() data : User){
    return this.userService.updateUser(id, data)
  }
}