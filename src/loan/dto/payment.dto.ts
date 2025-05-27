import { IsInt, IsPositive, IsNumber, Min } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';
export class PaymentDto {
    @IsInt()
    @ApiProperty({ description: 'ID del préstamo', example: 1 })
    loanId: number;


    @IsNumber()
    @IsPositive()
    @Min(0.01)
    @ApiProperty({ description: 'Monto pagado', example: 100 })
    amountPaid: number;
}
