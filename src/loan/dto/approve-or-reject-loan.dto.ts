// src/loan/dto/approve-or-reject-loan.dto.ts

import { IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ApproveOrRejectLoanDto {
    @IsNumber()
    @IsNotEmpty({ message: 'El ID del préstamo no puede estar vacío por favor envie el campo "loanId"' })
    @ApiProperty({ description: 'ID del préstamo', example: 1 })
    loanId: number; // id del préstamo a aprobar nota

    @IsBoolean({ message: 'El estado de aprobación debe ser un booleano' })
    @IsNotEmpty({ message: 'El estado de aprobación no puede estar vacío por favor envie el campo "approve"' })
    @ApiProperty({ description: 'Estado de aprobación', example: true })
    approve: boolean; // si se aprueba o no el préstamo

    @IsOptional()
    @IsNumber()
    @IsNotEmpty({ message: 'El interés no puede estar vacío' })
    @Min(0)
    @ApiProperty({ description: 'Tasa de interés', example: 0.05 })
    interestRate?: number; // interes del préstamo


    @IsString({ message: 'El nombre del revisor debe ser un texto' })
    @IsNotEmpty({ message: 'El nombre del revisor no puede estar vacío por favor envie el campo "reviewerName"' })
    @ApiProperty({ description: 'Nombre del revisor', example: 'Juan Pérez' })
    reviewerName: string; // persona que revisa el préstamo

    @IsOptional()
    @IsString({ message: 'El comentario debe ser un texto' })
    @IsNotEmpty({ message: 'El comentario no puede estar vacío' })
    @ApiProperty({ description: 'Comentario sobre la revisión', example: 'Revisión completada' })
    comment?: string; // comentario sobre la revisión

}