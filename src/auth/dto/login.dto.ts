// src/auth/dto/login.dto.ts
import { IsString, IsNotEmpty } from 'class-validator';

export class LoginDto {
    @IsString()
    @IsNotEmpty({ message: 'El nombre de usuario es obligatorio' })
    username: string;

    @IsString()
    @IsNotEmpty({ message: 'La contraseña es obligatoria' })
    password: string;
}