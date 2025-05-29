import { ApiProperty } from '@nestjs/swagger';


import { Expose } from 'class-transformer';
export class CreateUserResponseDto {
    @ApiProperty({ description: 'ID del usuario', example: 4 })
    @Expose()
    id: number;

    @ApiProperty({ description: 'Nombre de usuario', example: 'user' })
    @Expose()
    username: string;

    @ApiProperty({ description: 'Estado del usuario', example: true })
    @Expose()
    status: boolean;

}