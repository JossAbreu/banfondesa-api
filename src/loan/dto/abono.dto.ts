import { IsInt, IsPositive, IsNumber } from 'class-validator';

export class AbonoDto {
    @IsInt()
    loanId: number;

    @IsNumber()
    @IsPositive({ message: 'El monto debe ser positivo' })
    amount: number;
}
