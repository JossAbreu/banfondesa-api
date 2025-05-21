// src/auth/auth.service.ts
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  // Simulación de login — normalmente verificarías usuario y contraseña
  login(user: any) {
    const payload = { username: user.username, sub: user.id || 1 };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  getProfile(user: any) {
    return {
      message: 'Usuario autenticado',
      user,
    };
  }
}
