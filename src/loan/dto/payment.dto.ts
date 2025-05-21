import { IsInt, IsPositive, IsNumber } from 'class-validator';

export class PaymentDto {
    @IsInt()
    loanId: number;

    @IsInt()
    installmentNumber: number;

    @IsNumber()
    @IsPositive()
    amount: number;
}
