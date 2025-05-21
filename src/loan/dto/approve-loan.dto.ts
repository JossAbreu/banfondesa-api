// src/loan/dto/approve-loan.dto.ts
import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, Min } from 'class-validator';
export class ApproveLoanDto {
    @IsNumber()
    @IsNotEmpty()
    loanId: number;

    @IsBoolean()
    @IsNotEmpty()
    approve: boolean;

    @IsNumber()
    @Min(0)
    @IsOptional()
    interestRate?: number; // Solo requerido si approve === true
}