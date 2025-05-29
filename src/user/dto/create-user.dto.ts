// src/user/dto/create-user.dto.ts
import { IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty({ description: 'Nombre de usuario', example: 'miguel', format: 'string' })
    @IsString({ message: 'El nombre de usuario debe ser una cadena de texto.' })
    @IsNotEmpty({ message: 'El campo nombre de usuario no debe estar vacío.' })
    @MinLength(3, { message: 'El nombre de usuario debe tener al menos 3 caracteres.' })
    username: string;

    @ApiProperty({ description: 'contraseña', example: '********', format: 'password', minLength: 6 })
    @IsString({ message: 'La contraseña debe ser una cadena de texto.' })
    @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres.' })

    password: string;
}
