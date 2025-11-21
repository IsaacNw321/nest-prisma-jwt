import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { User } from 'src/user/entities/user.entitie';
import { CreateUserDto } from 'src/user/dto/createUser.dto';
import { UNP } from './dto/login.dto';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

async createUser(data: CreateUserDto) : Promise<User> {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const saveUser = {
      ...data,
       password : hashedPassword
    }
    return await this.userService.createUser(data)
    
  }


  async validateUser(email: string, pass: string): Promise<UNP |null> {
    const user = await this.userService.getUserByEmail(email);
    
     if (user && user.password === pass) {
      const { password, ...result } = user;
      return result
    }
    return null;
  }

  async login(user: UNP) {
    const payload = { username: user.userName, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async refreshToken(user: UNP) {
    const payload = { username: user.userName, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
