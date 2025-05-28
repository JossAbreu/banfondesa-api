import { IsInt, IsPositive, IsNumber, IsEmpty, Min } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
export class RepaymentDto {
    @IsInt()
    @ApiProperty({ description: 'ID del préstamo', example: 1 })
    loanId: number;

    @IsNumber()
    @IsPositive({ message: 'El monto debe ser positivo por favor enviar el campo "amount"' })
    @Min(1, { message: 'El monto debe ser mayor a 0' })
    @ApiProperty({ description: 'Monto del abono', example: 100, required: true, format: 'number' })
    amount: number;

    @IsEmpty()
    @ApiProperty({ description: 'Descripción del abono', example: 'Abono mensual', required: false })
    description?: string;
}
