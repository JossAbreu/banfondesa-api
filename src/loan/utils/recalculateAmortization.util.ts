


import { NotFoundException } from '@nestjs/common';
import { generateAmortization } from '@loan/utils/generateAmortization.util';
import { calculateDueDate } from '@loan/utils/calculateDueDate.util';
import { Repository } from 'typeorm';
import { Loan } from '@loan/entities/loan.entity';
import { LoanAmortization } from '@loan/entities/loan-amortization.entity';
import { CapitalPayment } from '@loan/entities/capital-payment.entity';


export async function recalculateAmortization(loanId: number, loanRepo: Repository<Loan>,
    loanAmortizationRepo: Repository<LoanAmortization>,
    capitalPaymentRepo: Repository<CapitalPayment>) {
    const loan = await loanRepo.findOne({ where: { id: loanId } });
    if (!loan) throw new NotFoundException('Préstamo no encontrado');

    // primero obtengo las cuatas pagadas
    const paidInstallments = await loanAmortizationRepo.find({
        where: { loanId, paid: true },
        order: { installmentNumber: 'ASC' }
    });

    const lastPaidInstallment = paidInstallments.length;


    //luego obtengo el capital restante
    const remainingBalance = await calculateRemainingBalance(loanId, loanRepo, loanAmortizationRepo, capitalPaymentRepo);

    // Obtener número de cuotas restantes 
    const remainingTerm = loan.termMonths - lastPaidInstallment;

    if (remainingTerm <= 0) {
        // actualizar el estado del préstamo a 'pagado'
        loan.status = 'pagado';
        return; // salir si no hay cuotas restantes

    }

    // Generar nueva amortización para el capital restante
    // console.log('Capital restante:', remainingBalance);
    // console.log('Número de cuotas restantes:', remainingTerm);
    const newAmortization = await generateAmortization(
        remainingBalance,
        remainingTerm,
        loan.interestRate,
        loan.amortizationType as 'fija' | 'variable',
    );
    // console.log('Amortización recalculada:', newAmortization);
    // Eliminar solo las cuotas no pagadas
    await this.loanAmortizationRepo.delete({
        loanId,
        paid: false,
    });





    // Insertar las nuevas cuotas recalculadas, ajustando el número de cuota
    const startDate = new Date();
    for (let i = 0; i < newAmortization.length; i++) {
        const item = newAmortization[i];
        await loanAmortizationRepo.save({
            loanId,
            installmentNumber: lastPaidInstallment + 1 + i,
            dueDate: calculateDueDate(startDate, lastPaidInstallment + 1 + i),
            principal: item.principal,
            interest: item.interest,
            totalPayment: item.total,
            paid: false,
            paymentDate: null
        });
    }

    //validar si las cuotas pendientes son 0 y si son son 0 cambiar el estado del préstamo a pagado y a las amortizaciones pagadas marcarlas pagadas
    const pendingPayments = await this.loanAmortizationRepo.count({
        where: { loanId, paid: false },
    });

    if (pendingPayments === 0) {
        const loan = await this.loanRepo.findOne({ where: { id: loanId } });
        if (loan) {
            loan.status = 'pagado';
            await loanRepo.save(loan);
        }

        await loanAmortizationRepo.update(
            { loanId, paid: true },
            { paymentDate: new Date() }
        );
    }
}

export async function calculateRemainingBalance(loanId: number, loanRepo: Repository<Loan>,
    loanAmortizationRepo: Repository<LoanAmortization>,
    capitalPaymentRepo: Repository<CapitalPayment>): Promise<number> {

    const loan = await loanRepo.findOne({ where: { id: loanId } });
    if (!loan) throw new NotFoundException('Préstamo no encontrado');

    const amortizations = await loanAmortizationRepo.find({
        where: { loanId, paid: false },
    });
    if (!amortizations || amortizations.length === 0) {
        throw new NotFoundException('No hay cuotas pendientes');
    }

    // También considera los abonos extras al capital
    const capitalPayments = await capitalPaymentRepo.find({
        where: { loanId },
        relations: ['loan'],
    });

    // console.log('Amortizaciones pendientes:', amortizations);
    // console.log('Abonos al capital:', capitalPayments);

    const totalRemaining = amortizations.reduce((sum, a) => sum + Number(a.principal), 0);
    const totalCapitalPaid = capitalPayments.reduce((sum, p) => sum + Number(p.amount), 0);

    // console.log('Total capital restante:', totalRemaining);
    // console.log('Total capital pagado:', totalCapitalPaid);

    // console.log('Capital restante después de abonos:', totalRemaining - totalCapitalPaid);
    return Math.max(totalRemaining - totalCapitalPaid, 0);
}
