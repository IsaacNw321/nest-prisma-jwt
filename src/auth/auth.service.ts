import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { Prisma, User } from 'generated/prisma';
import * as bcrypt from 'bcrypt';
import { UNP } from './dto/login.dto';
@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

async createUser(data: Prisma.UserCreateInput) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const saveUser = {
      ...data,
       password : hashedPassword
    }
    return await this.userService.createUser(data)
    
  }


  async validateUser(email: string, pass: string): Promise<UNP |null> {
    const user = await this.userService.getUserByEmail(email);
    
     if (user) {
      const { password, ...result } = user;
      return result
    }
    return null;
  }

  async login(user: UNP) {
    const payload = { username: user.firstName, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async refreshToken(user: any) {
    const payload = { username: user.firstName, sub: user.sub };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
