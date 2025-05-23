// src/user/dto/update-user.dto.ts
import { IsBoolean, IsOptional, IsString, MinLength } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
export class UpdateUserDto {
    @IsOptional()
    @IsString({ message: 'El nombre de usuario debe ser una cadena de texto' })
    @ApiProperty({ description: 'Nombre de usuario', example: 'Juanito', format: 'string' })
    username?: string;

    @IsOptional()
    @IsString({ message: 'La contraseña debe ser una cadena de texto' })
    @MinLength(6)
    @ApiProperty({ description: 'Contraseña', example: '*******', format: 'password', minLength: 6 })
    password?: string;

    @IsOptional()
    @IsBoolean({ message: 'El estado debe ser un valor booleano' })
    @ApiProperty({ description: 'Estado del usuario', example: true, format: 'boolean' })
    status?: boolean;
}
