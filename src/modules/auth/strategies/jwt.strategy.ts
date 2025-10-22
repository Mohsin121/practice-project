import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
     //extract token from cookies
      jwtFromRequest: ExtractJwt.fromExtractors([(req) => {
        return req?.cookies?.accessToken;
      }]),
      
      // DON'T accept expired tokens
      ignoreExpiration: false,
      
      // SECRET KEY to verify token signature
      secretOrKey: process.env.JWT_SECRET as string,
    });
  }

  // This runs AFTER token is verified
  // "payload" is the decoded token data
  async validate(payload: any) {
    // This object gets attached to request.user
    return { 
      userId: payload.sub,    // 'sub' = subject (user ID)
      email: payload.email 
    };
  }
}