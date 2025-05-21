// src/user/dto/update-user.dto.ts
import { IsBoolean, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
    @IsOptional()
    @IsString({ message: 'El nombre de usuario debe ser una cadena de texto' })
    username?: string;

    @IsOptional()
    @IsString({ message: 'La contraseña debe ser una cadena de texto' })
    @MinLength(6)
    password?: string;

    @IsOptional()
    @IsBoolean({ message: 'El estado debe ser un valor booleano' })
    status?: boolean;
}
