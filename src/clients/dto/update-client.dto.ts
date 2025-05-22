// src/user/dto/update-user.dto.ts
import { IsString, IsOptional } from 'class-validator';

export class UpdateClientDto {

    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsString()
    last_name?: string;

    @IsOptional()
    @IsString()
    email?: string;

    @IsOptional()
    @IsString()
    phone?: string;

    @IsOptional()
    @IsString()
    address?: string;

}
