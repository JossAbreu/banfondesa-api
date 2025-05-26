


import { NotFoundException } from '@nestjs/common';
import { generateAmortization } from '@loan/utils/generateAmortization.util';
import { calculateDueDate } from '@loan/utils/calculateDueDate.util';
import { Repository } from 'typeorm';
import { Loan } from '@loan/entities/loan.entity';
import { LoanAmortization } from '@loan/entities/loan-amortization.entity';
import { CapitalPayment } from '@loan/entities/capital-payment.entity';


export async function recalculateAmortization(
    loanId: number,
    loanRepo: Repository<Loan>,
    loanAmortizationRepo: Repository<LoanAmortization>,
    capitalPaymentRepo: Repository<CapitalPayment>
) {
    const loan = await loanRepo.findOne({ where: { id: loanId } });
    if (!loan) throw new NotFoundException('Préstamo no encontrado');

    const paidInstallments = await loanAmortizationRepo.find({
        where: { loanId, paid: true },
        order: { installmentNumber: 'ASC' },
    });

    const lastPaidInstallment = paidInstallments.length;
    const remainingBalance = await calculateRemainingBalance(loanId, loanRepo, loanAmortizationRepo, capitalPaymentRepo);
    console.log('Saldo restante:', remainingBalance);
    if (remainingBalance <= 0) {
        await loanAmortizationRepo.update(
            { loanId, paid: false },
            {
                paid: true,
                principal: 0,
                interest: 0,
                totalPayment: 0,
                paymentDate: new Date(),
            }
        );

        loan.status = 'pagado';
        await loanRepo.save(loan);
        return;
    }

    const remainingTerm = loan.termMonths - lastPaidInstallment;
    if (remainingTerm <= 0) {
        loan.status = 'pagado';
        await loanRepo.save(loan);
        return;
    }

    const newAmortization = await generateAmortization(
        remainingBalance,
        remainingTerm,
        loan.interestRate,
        loan.amortizationType as 'fija' | 'variable'
    );

    // Elimina las amortizaciones pendientes para recalcular
    console.log('Eliminando amortizaciones pendientes para recalcular...', loanId);
    await loanAmortizationRepo.delete({ loanId, paid: false });



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
            paymentDate: null,
        });
    }


    // si el balance permaneciente es 0, marcar las amortizaciones pendientes como pagadas
    const remainingBalanceAfterRecalculation = await calculateRemainingBalance(loanId, loanRepo, loanAmortizationRepo, capitalPaymentRepo);
    if (remainingBalanceAfterRecalculation <= 0) {
        await loanAmortizationRepo.update(
            { loanId, paid: false },
            {
                paid: true,
                principal: 0,
                interest: 0,
                totalPayment: 0,
                paymentDate: new Date(),
            }
        );

        loan.status = 'pagado';
        await loanRepo.save(loan);
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

    // Si no hay amortizaciones pendientes, significa que el préstamo ya ha sido pagado
    if (!amortizations || amortizations.length === 0) {
        throw new NotFoundException('No hay cuotas pendientes ,el prestamos ya ha sido pagado');
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
