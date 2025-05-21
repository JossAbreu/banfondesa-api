// src/auth/strategies/jwt.strategy.ts
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false, // asegura que el token expire correctamente
      secretOrKey: process.env.JWT_SECRET || 'jwt-secret', // usa el mismo que usas en login
    });
  }

  async validate(payload: any) {
    return { id: payload.sub, username: payload.username };
  }
}
