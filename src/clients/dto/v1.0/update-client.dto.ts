// src/user/dto/update-user.dto.ts
import { IsString, IsNotEmpty, IsOptional, IsEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PartialType } from '@nestjs/swagger';
import { CreateClientDto } from './create-client.dto';

export class UpdateClientDto extends PartialType(CreateClientDto) {
    @ApiProperty({ description: 'Nombre del cliente', example: 'Miguel', format: 'string' })
    @IsOptional()
    @IsString({ message: 'El nombre debe ser una cadena de texto' })
    @IsNotEmpty({ message: 'El campo nombre no debe estar vacío' })
    name?: string;

    @ApiProperty({ description: 'Apellido del cliente', example: 'Peralta', format: 'string' })
    @IsOptional()
    @IsString({ message: 'El apellido debe ser una cadena de texto' })
    @IsNotEmpty({ message: 'El campo apellido no debe estar vacío' })
    last_name?: string;

    @ApiProperty({ description: 'Correo electrónico del cliente', example: 'miguel.peralta@example.com', format: 'string' })
    @IsOptional()
    @IsString({ message: 'El correo electrónico debe ser una cadena de texto' })
    @IsNotEmpty({ message: 'El campo correo electrónico no debe estar vacío' })
    email?: string;

    @ApiProperty({ description: 'Teléfono del cliente', example: '+1 234 567 8901', format: 'string' })
    @IsOptional()
    @IsString({ message: 'El teléfono debe ser una cadena de texto' })
    @IsEmpty({ message: 'El campo teléfono no debe estar vacío' })
    phone?: string;

    @ApiProperty({ description: 'Dirección del cliente', example: 'Calle Falsa 123', format: 'string' })
    @IsOptional()
    @IsString({ message: 'La dirección debe ser una cadena de texto' })
    @IsEmpty({ message: 'El campo dirección no debe estar vacío' })
    address?: string;

}
