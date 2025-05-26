import { IsInt, IsPositive, IsNumber, IsEmpty } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
export class AbonoDto {
    @IsInt()
    @ApiProperty({ description: 'ID del préstamo', example: 1 })
    loanId: number;

    @IsNumber()
    @IsPositive({ message: 'El monto debe ser positivo por favor enviar el campo "amount"' })
    @ApiProperty({ description: 'Monto del abono', example: 100 })
    amount: number;

    @IsEmpty()
    @ApiProperty({ description: 'Descripción del abono', example: 'Abono mensual', required: false })
    description?: string;
}
