
import { Controller, Post, Request, UseGuards, Get, Version, Body } from '@nestjs/common';
import { AuthServiceV1 } from '@auth/services/v1.0/auth.service';
import { JwtAuthGuard } from '@auth/guards/jwt.guard';
import { LoginDto } from '@/auth/dto/v1.0/login.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { DocLogin, DocGetProfile } from '@/auth/docs/v1.0/auth.docs';


@ApiTags('Autenticación 🔐')
@Controller({ path: 'auth', version: '1.0' })
export class AuthControllerV1 {
  constructor(private readonly AuthServiceV1: AuthServiceV1) { }


  @DocLogin()
  @Post()
  async login(@Body() loginDto: LoginDto) {
    return this.AuthServiceV1.login(loginDto);
  }

  @DocGetProfile()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('access-token')
  @Get()
  getProfile(@Request() req) {
    return req.user;
  }
}
