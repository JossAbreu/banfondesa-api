
import { Controller, Post, Request, UseGuards, Get, Body } from '@nestjs/common';
import { AuthService } from '@auth/auth.service';
import { JwtAuthGuard } from '@auth/guards/jwt.guard';
import { LoginDto } from '@auth/dto/login.dto';
import { ApiResponse, ApiTags, ApiOperation } from '@nestjs/swagger';
import { DocLogin, DocGetProfile } from '@auth/docs/auth.docs';

@ApiTags('Autenticación 🔐')
@Controller('v1.0/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }


  @DocLogin()
  @Post()
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @DocGetProfile()
  @UseGuards(JwtAuthGuard)
  @Get()
  getProfile(@Request() req) {
    return req.user;
  }
}
