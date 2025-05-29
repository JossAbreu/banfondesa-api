
import { ApiProperty } from '@nestjs/swagger';


import { UserResponseDto } from '@/user/dto/v1.0/user-response.dto';
export class LoginResponseDto {



    @ApiProperty({ description: 'Mensaje de respuesta', example: 'Login exitoso' })
    message: string;

    @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
    token: string;


}