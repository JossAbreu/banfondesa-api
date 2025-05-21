// src/loan/dto/approve-loan.dto.ts
import { IsBoolean, IsNumber } from 'class-validator';

export class ApproveLoanDto {
    @IsNumber()
    loanId: number;

    @IsBoolean()
    approve: boolean;

    @IsNumber()
    interestRate: number;
}