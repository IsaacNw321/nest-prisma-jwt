import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserService } from 'src/user/user.service';
import { Request } from 'express';
import { MySecret } from 'src/config';

const cookieExtractor = (req: Request): string | null => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies['access_token'];
  }
  return token;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
      ignoreExpiration: false,
      secretOrKey: MySecret
    });
  }

  async validate(payload: { sub: string; username: string }) {
    const user = await this.userService.getUserById(payload.sub);
    if (!user) {
      throw new UnauthorizedException('User not found or token is invalid');
    }
    const { password, ...result } = user;
    return result;
  }
}