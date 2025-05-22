import { IsInt, IsPositive, IsNumber, Min } from 'class-validator';

export class PaymentDto {
    @IsInt()
    loanId: number;

    @IsInt()
    installmentNumber: number;

    @IsNumber()
    @IsPositive()
    @Min(0.01)
    amountPaid: number;
}
