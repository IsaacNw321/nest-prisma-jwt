import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { LoginDto } from './dto/login.dto';
import { CreateUserDto } from './dto/login.dto';
import { Prisma } from 'generated/prisma';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return this.authService.login(user);
  }
  @Post('signup')
  async signup(@Body() createUserDto: Prisma.UserCreateInput) {
    const result = await this.authService.createUser(createUserDto); 
    return result; 
  }
}
