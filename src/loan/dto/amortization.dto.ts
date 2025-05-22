import { IsNumber, IsPositive, Max, IsInt, Min, IsIn } from 'class-validator';

export class AmortizationDto {
    @IsNumber()
    @IsPositive()
    amount: number;

    @IsInt()
    @Min(1)
    termMonths: number;

    @IsNumber()
    @Min(0, { message: 'el interes no puede ser menor a 0' })
    @Max(0.99, { message: 'El interés no puede ser mayor a 0.99' })
    interestRate: number;

    @IsIn(['fija', 'variable'])
    amortizationType: 'fija' | 'variable';
}
