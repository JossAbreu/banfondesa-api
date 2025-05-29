import { IsInt, IsNumber, IsEnum, Max, Min, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';


export class CreateLoanDto {

    @ApiProperty({ description: 'ID del cliente', example: 1 })
    @IsInt({ message: 'el id debe ser un número entero' })
    @IsPositive({ message: 'el id debe ser un número entero positivo' })
    clientId: number;

    @ApiProperty({ description: 'Monto del préstamo', example: 1000 })
    @IsInt({ message: 'el monto debe ser un número entero' })
    @Min(1, { message: 'el monto no puede ser menor a 1' })
    @IsPositive({ message: 'el monto debe ser un número entero positivo' })
    amount: number;

    @ApiProperty({ description: 'Plazo del préstamo en meses', example: 12 })
    @IsInt({ message: 'el plazo debe ser un número entero' })
    @Min(1, { message: 'el plazo no puede ser menor a 1 mes' })
    @Max(60, { message: 'el plazo no puede ser mayor a 60 meses' })
    termMonths: number;

    @ApiProperty({ description: 'Tasa de interés anual', example: 0.05 })
    @IsNumber()
    @Min(0, { message: 'el interes no puede ser menor a 0' })
    @Max(0.99, { message: 'El interés no puede ser mayor a 0.99' })
    interestRate: number;

    @ApiProperty({ description: 'Tipo de amortización', example: 'fija' })
    @IsEnum(['fija', 'variable'], {
        message: 'amortizationType must be "fija" or "variable"',
    })
    amortizationType: 'fija' | 'variable';
}
