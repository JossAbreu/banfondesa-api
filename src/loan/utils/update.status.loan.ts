// Método para calcular la fecha de vencimiento

import { BadRequestException, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Loan } from '@loan/entities/loan.entity';


export async function updateStatusLoan(
    loanId: number,
    loanRepo: Repository<Loan>,
    status: "pendiente" | "aprobado" | "pagado" | "rechazado"
) {
    const loan = await loanRepo.findOne({ where: { id: loanId } });
    if (!loan) throw new NotFoundException('Préstamo no encontrado');


    loan.status = status;
    await loanRepo.save(loan);
}




