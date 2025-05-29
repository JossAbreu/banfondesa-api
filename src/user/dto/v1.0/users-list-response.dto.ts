import { ApiProperty } from '@nestjs/swagger';


import { Expose } from 'class-transformer';



export class UserListResponseDto {
    @ApiProperty({ description: 'Usuarios obtenidos exitosamente', example: 'Lista de usuarios registrados' })
    @Expose()
    message: string;

    @ApiProperty({ description: 'Lista de usuarios', example: [{ id: 1, username: 'user1', status: true, }] })
    @Expose()
    users: {
        id: number;
        username: string;
        status: boolean;

    }[];

}