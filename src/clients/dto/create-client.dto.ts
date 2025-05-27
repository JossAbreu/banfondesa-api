//src/clients/dto/create-client.dto.ts
import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateClientDto {
    @ApiProperty({ description: 'Nombre del cliente ', example: 'Miguel', format: 'string' })
    @IsString()
    name: string;

    @ApiProperty({ description: 'Apellido del cliente', example: 'Peralta', format: 'string' })
    @IsString()
    last_name: string;

    @ApiProperty({ description: 'Correo electrónico del cliente', example: 'miguel.peralta@example.com', format: 'string' })
    @IsString()
    email: string;

    @ApiProperty({ description: 'Teléfono del cliente', example: '+1 234 567 8901', format: 'string' })
    @IsString()
    phone: string;

    @ApiProperty({ description: 'Dirección del cliente', example: 'Calle Falsa 123', format: 'string' })
    @IsString()
    address: string;


}
