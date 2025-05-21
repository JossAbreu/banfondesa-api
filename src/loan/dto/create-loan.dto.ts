import { IsInt, IsNumber, IsEnum, Max, Min, IsPositive } from 'class-validator';

export class CreateLoanDto {


    @IsInt()
    @IsPositive()
    amount: number;

    @IsInt()
    @Min(1, { message: 'el plazo no puede ser menor a 1 mes' })
    @Max(12, { message: 'el plazo no puede ser mayor a 12 meses' })
    termMonths: number;

    @IsNumber()
    @Min(0, { message: 'el interes no puede ser menor a 0' })
    @Max(0.99, { message: 'El interés no puede ser mayor a 0.99' })
    interestRate: number;

    @IsEnum(['fija', 'variable'], {
        message: 'amortizationType must be "fija" or "variable"',
    })
    amortizationType: 'fija' | 'variable';
}
