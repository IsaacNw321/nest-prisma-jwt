import { Controller, Post, Body, UnauthorizedException } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { LoginDto } from './dto/login.dto';
import { User } from 'generated/prisma';
import { UserService } from 'src/user/user.service';
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const user = await this.authService.validateUser(loginDto.email, loginDto.password);
    if (!user) {
      throw new UnauthorizedException();
    }
    return this.authService.login(user);
  }
  @Post('signup')  
  async createTask(@Body() data : User){
    return this.authService.createUser(data)
  }
}
