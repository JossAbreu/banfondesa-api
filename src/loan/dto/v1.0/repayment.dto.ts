import { IsInt, IsPositive, IsNumber, IsString, Min, IsOptional, IsNotEmpty } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
export class RepaymentDto {
    @IsInt()
    @ApiProperty({ description: 'ID del préstamo', example: 1 })
    @IsPositive({ message: 'El ID del préstamo debe ser un número positivo' })
    loanId: number;

    @IsNumber()
    @IsPositive({ message: 'El monto debe ser positivo por favor enviar el campo "amount"' })
    @Min(1, { message: 'El monto debe ser mayor a 0' })
    @ApiProperty({ description: 'Monto del abono', example: 100, required: true, format: 'number' })
    amount: number;

    @IsOptional()
    @IsNotEmpty({ message: 'La descripción no puede estar vacía' })
    @IsString({ message: 'La descripción debe ser una cadena de texto' })
    @ApiProperty({ description: 'Descripción del abono', example: 'Abono mensual', required: false })
    description?: string;
}
