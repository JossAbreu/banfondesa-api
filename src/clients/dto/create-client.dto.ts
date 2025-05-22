// src/user/dto/create-user.dto.ts
import { IsString } from 'class-validator';

export class CreateClientDto {
    @IsString()
    name: string;

    @IsString()
    last_name: string;

    @IsString()
    email: string;

    @IsString()
    phone: string;

    @IsString()
    address: string;


}
