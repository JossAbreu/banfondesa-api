import { IsInt, IsPositive, IsNumber, IsEmpty } from 'class-validator';

export class AbonoDto {
    @IsInt()
    loanId: number;

    @IsNumber()
    @IsPositive({ message: 'El monto debe ser positivo por favor enviar el campo "amount"' })
    amount: number;
}
