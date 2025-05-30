import { IsInt, IsNumber, IsNotEmpty, Max, Min, IsPositive, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

import { CreateLoanDto } from '@loan/dto/v1.0/create-loan.dto';

export class LoanListResponseDto {

    @ApiProperty({ description: 'Mensaje de éxito', example: 'Lista de préstamos obtenidos exitosamente' })
    @IsString({ message: 'el mensaje debe ser una cadena de texto' })
    @IsNotEmpty({ message: 'el mensaje no puede estar vacío' })
    message: string;


    @ApiProperty({ description: 'Lista de préstamos', type: [CreateLoanDto] })
    loans: CreateLoanDto[];

}