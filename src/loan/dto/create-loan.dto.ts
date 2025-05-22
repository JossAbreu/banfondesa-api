import { IsInt, IsNumber, IsEnum, Max, Min, IsPositive } from 'class-validator';

export class CreateLoanDto {

    @IsInt({ message: 'el id debe ser un número entero' })
    @IsPositive({ message: 'el id debe ser un número entero positivo' })
    clientId: number;

    @IsInt({ message: 'el monto debe ser un número entero' })
    @IsPositive({ message: 'el monto debe ser un número entero positivo' })
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
