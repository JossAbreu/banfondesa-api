// src/loan/dto/approve-loan.dto.ts

import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
export class ApproveLoanDto {
    @IsNumber()
    @IsNotEmpty({ message: 'El ID del préstamo no puede estar vacío por favor envie el campo "loanId"' })
    loanId: number; // id del préstamo a aprobar nota

    @IsBoolean({ message: 'El estado de aprobación debe ser un booleano' })
    @IsNotEmpty({ message: 'El estado de aprobación no puede estar vacío por favor envie el campo "approve"' })
    approve: boolean; // si se aprueba o no el préstamo

    @IsOptional()
    @IsNumber()
    @IsNotEmpty({ message: 'El interés no puede estar vacío' })
    @Min(0)
    interestRate?: number; // interes del préstamo


    @IsString({ message: 'El nombre del revisor debe ser un texto' })
    @IsNotEmpty({ message: 'El nombre del revisor no puede estar vacío por favor envie el campo "reviewerName"' })
    reviewerName: string; // persona que revisa el préstamo

    @IsOptional()
    @IsString({ message: 'El comentario debe ser un texto' })
    @IsNotEmpty({ message: 'El comentario no puede estar vacío' })
    comment?: string; // comentario sobre la revisión

}