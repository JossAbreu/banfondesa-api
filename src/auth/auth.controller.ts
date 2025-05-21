// src/auth/auth.controller.ts
import { Controller, Post, Request, UseGuards, Get, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt.guard';
import { LoginDto } from './dto/login.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('auth')
@Controller('v1.0/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }


  @Post()
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto); // << Aquí tú ya haces la validación
  }
  @UseGuards(JwtAuthGuard)
  @Get()
  getProfile(@Request() req) {
    return req.user;
  }
}
