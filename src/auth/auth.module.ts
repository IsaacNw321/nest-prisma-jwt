import { Module } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { AuthController } from '../auth/auth.controller';
import { UserModule } from 'src/user/user.module';
import { UserService } from 'src/user/user.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../auth/jwt.strategy';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  imports: [
    UserModule,
    PrismaModule,
    PassportModule,
    JwtModule.register({
      secret: 'yourSecretKey', 
      signOptions: { expiresIn: '60m' },
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
