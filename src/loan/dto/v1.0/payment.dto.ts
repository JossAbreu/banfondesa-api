import { IsInt, IsPositive, IsNumber, Min } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
export class PaymentDto {
    @IsInt()
    @IsPositive({ message: 'ID del préstamo debe ser un número positivo' })
    @ApiProperty({ description: 'ID del préstamo', example: 1 })
    loanId: number;


    @IsNumber()
    @IsPositive({ message: 'Monto pagado debe ser un número positivo' })
    @Min(1, { message: 'Monto pagado debe ser mayor a 0' })
    @ApiProperty({ description: 'Monto pagado', example: 100 })
    amountPaid: number;
}
