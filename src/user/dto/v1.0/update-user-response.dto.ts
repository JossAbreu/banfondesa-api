// src/user/dto/update-user.dto.ts
import { IsBoolean, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
export class UpdateUserResponseDto {
    @IsOptional()
    @IsString({ message: 'El nombre de usuario debe ser una cadena de texto' })
    @IsNotEmpty({ message: 'El campo nombre de usuario no debe estar vacío' })
    @ApiProperty({ description: 'Nombre de usuario', example: 'Juanito', format: 'string' })
    username?: string;

    @IsOptional()
    @IsString({ message: 'La contraseña debe ser una cadena de texto' })
    @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
    @IsNotEmpty({ message: 'El campo contraseña no debe estar vacío' })
    @ApiProperty({ description: 'Contraseña', example: '*******', format: 'password', minLength: 6 })
    password?: string;

    @IsOptional()
    @IsBoolean({ message: 'El estado debe ser un valor booleano' })
    @ApiProperty({ description: 'Estado del usuario', example: true, format: 'boolean' })
    status?: boolean;
}
