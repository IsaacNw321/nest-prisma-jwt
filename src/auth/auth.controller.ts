import {
  Controller,
  Post,
  Body,
  Res,
  HttpCode,
  HttpStatus,
  UnauthorizedException,
  UseGuards,
  Req,
} from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { Response, Request } from 'express';
import { LoginDto } from './dto/login.dto';
import { User } from 'generated/prisma';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}
  
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(@Body() loginDto: LoginDto,
  @Res({ passthrough: true }) response: Response,
  ) {
    const user = await this.authService.validateUser(loginDto.email, loginDto.password);
    if (!user) {
       throw new UnauthorizedException('Invalid credentials');
    }
    const access_token  = await this.authService.login(user);
    
    response.cookie('access_token', access_token, {
  httpOnly: true,
  secure: false, 
  sameSite: 'none', 
  maxAge: 3600000,
});

    return  access_token ;

  }
  @Post('signup')  
  async createUser(@Body() data : User){
    const newUser = await this.authService.createUser(data)
    if(!newUser){
      throw new Error("Something went wrong")
    }
    return this.authService.login(newUser)
  }

  @Post('refresh')
  async refreshToken(@Req() req) {
    const { access_token } = await this.authService.refreshToken(req.user);
    return { access_token };
  }
}
