
import { IsString, IsNotEmpty } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
export class LoginDto {
    @ApiProperty({ description: 'Nombre de usuario', example: 'miguel', format: 'string' })
    @IsString()
    @IsNotEmpty({ message: 'El nombre de usuario es obligatorio' })
    username: string;

    @ApiProperty({ description: 'Contraseña', example: '123456', format: 'password' })
    @IsString()
    @IsNotEmpty({ message: 'La contraseña es obligatoria' })
    password: string;
}