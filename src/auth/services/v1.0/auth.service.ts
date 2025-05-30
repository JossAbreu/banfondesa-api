
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserBaseService } from '@/user/services/user.base.service';
import { LoginDto } from '@auth/dto/v1.0/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthServiceV1 {
  constructor(
    private readonly userService: UserBaseService,
    private readonly jwtService: JwtService,
  ) { }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.userService.findByUsername(username);
    if (user && await bcrypt.compare(password, user.password)) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(loginDto: LoginDto) {
    const user = await this.userService.findByUsername(loginDto.username);

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    if (!user.status) {
      throw new UnauthorizedException('Usuario deshabilitado');
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }
    const payload = { username: user.username, sub: user.id };
    const token = this.jwtService.sign(payload);

    return {
      message: 'Login exitoso',
      access_token: token,

    };
  }
}