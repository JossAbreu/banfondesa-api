import { ApiProperty } from '@nestjs/swagger';


import { Expose } from 'class-transformer';



export class UserResponseDto {
    @ApiProperty({
        description: 'Mensaje de respuesta',
        example: 'Usuario creado o actualizado exitosamente',
    })
    @Expose()
    message: string = 'Usuario creado o actualizado exitosamente';

    @ApiProperty({
        description: 'usuario',
        example: { id: 1, username: 'user1', status: true },
    })
    @Expose()
    user: {
        id: number;
        username: string;
        status: boolean;
    } = { id: 0, username: '', status: true }
}