// src/user/dto/create-user.dto.ts
import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({ description: 'Nombre de usuario', example: 'miguel', format: 'string' })
    @IsString()
    username: string;

    @ApiProperty({ description: 'contraseña', example: '********', format: 'password' })
    @IsString()
    @MinLength(6)
    password: string;
}
