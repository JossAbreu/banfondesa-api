// src/user/dto/update-user.dto.ts
import { IsString, IsOptional } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
import { PartialType } from '@nestjs/swagger';
import { CreateClientDto } from './create-client.dto';
export class UpdateClientDto extends PartialType(CreateClientDto) {
    @ApiProperty({ description: 'Nombre del cliente', example: 'Miguel', format: 'string' })
    @IsOptional()
    @IsString()
    name?: string;

    @ApiProperty({ description: 'Apellido del cliente', example: 'Peralta', format: 'string' })
    @IsOptional()
    @IsString()
    last_name?: string;

    @ApiProperty({ description: 'Correo electrónico del cliente', example: 'miguel.peralta@example.com', format: 'string' })
    @IsOptional()
    @IsString()
    email?: string;

    @ApiProperty({ description: 'Teléfono del cliente', example: '+1 234 567 8901', format: 'string' })
    @IsOptional()
    @IsString()
    phone?: string;

    @ApiProperty({ description: 'Dirección del cliente', example: 'Calle Falsa 123', format: 'string' })
    @IsOptional()
    @IsString()
    address?: string;

}
