import { IsNumber, IsPositive, Max, IsInt, Min, IsIn } from 'class-validator';


import { ApiProperty } from '@nestjs/swagger';
export class AmortizationDto {
    @IsNumber()
    @IsPositive({ message: 'El monto del préstamo debe ser un número positivo' })
    @Min(1, { message: 'El monto del préstamo debe ser mayor a 0' })
    @ApiProperty({ description: 'Monto del préstamo', example: 1000 })
    amount: number;

    @IsInt()
    @Min(1, { message: 'El plazo en meses debe ser un número entero positivo' })
    @ApiProperty({ description: 'Plazo en meses', example: 12 })
    termMonths: number;

    @IsNumber()
    @Min(0, { message: 'el interes no puede ser menor a 0' })
    @Max(0.99, { message: 'El interés no puede ser mayor a 0.99' })
    @ApiProperty({ description: 'Tasa de interés', example: 0.05 })
    interestRate: number;

    @IsIn(['fija', 'variable'])
    @ApiProperty({ description: 'Tipo de amortización', example: 'fija' })
    amortizationType: 'fija' | 'variable';
}
