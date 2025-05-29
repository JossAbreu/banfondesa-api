//src/clients/dto/create-client.dto.ts
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateClientDto {
    @ApiProperty({ description: 'Nombre del cliente ', example: 'Miguel', format: 'string' })
    @IsString({ message: 'El nombre debe ser una cadena de texto.' })
    @IsNotEmpty({ message: 'El campo nombre no debe estar vacío.' })
    name: string;

    @ApiProperty({ description: 'Apellido del cliente', example: 'Peralta', format: 'string' })
    @IsString({ message: 'El apellido debe ser una cadena de texto.' })
    @IsNotEmpty({ message: 'El campo apellido no debe estar vacío.' })
    last_name: string;

    @ApiProperty({ description: 'Correo electrónico del cliente', example: 'miguel.peralta@example.com', format: 'string' })
    @IsEmail({}, { message: 'El correo electrónico debe ser una dirección de correo válida.' })
    @IsString({ message: 'El correo electrónico debe ser una cadena de texto.' })
    email: string;

    @ApiProperty({ description: 'Teléfono del cliente', example: '+1 234 567 8901', format: 'string' })
    @IsString({ message: 'El teléfono debe ser una cadena de texto.' })
    @IsNotEmpty({ message: 'El campo teléfono no debe estar vacío.' })
    phone: string;

    @ApiProperty({ description: 'Dirección del cliente', example: 'Calle Falsa 123', format: 'string' })
    @IsString({ message: 'La dirección debe ser una cadena de texto.' })
    @IsNotEmpty({ message: 'El campo dirección no debe estar vacío.' })
    address: string;


}
