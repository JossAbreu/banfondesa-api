


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
    try {
        // Buscar el préstamo
        const loan = await loanRepo.findOne({ where: { id: loanId } });
        if (!loan) throw new NotFoundException('Préstamo no encontrado');

        // Si ya está pagado, no hacer nada
        if (loan.status === 'pagado') return;

        // Obtener cuotas ya pagadas
        const paidInstallments = await loanAmortizationRepo.find({
            where: { loanId, paid: true },
            order: { installmentNumber: 'ASC' },
        });
        const lastPaidInstallment = paidInstallments.length;

        // Calcular saldo restante
        const remainingBalance = await calculateRemainingBalance(
            loanId, loanRepo, loanAmortizationRepo, capitalPaymentRepo
        );

        console.log('Saldo restante:', remainingBalance);

        // Calcular el plazo restante
        const remainingTerm = loan.termMonths - lastPaidInstallment;
        if (remainingTerm <= 0) {
            loan.status = 'pagado';
            await loanRepo.save(loan);
            return;
        }

        // Generar nueva tabla de amortización
        const newAmortization = await generateAmortization(
            remainingBalance,
            remainingTerm,
            loan.interestRate,
            loan.amortizationType as 'fija' | 'variable'
        );

        // Obtener cuotas no pagadas actuales
        const unpaidInstallments = await loanAmortizationRepo.find({
            where: { loanId, paid: false },
            order: { installmentNumber: 'ASC' },
        });

        const startDate = new Date();

        for (let i = 0; i < newAmortization.length; i++) {
            const item = newAmortization[i];
            const installmentNumber = lastPaidInstallment + 1 + i;
            const dueDate = calculateDueDate(startDate, installmentNumber);

            if (i < unpaidInstallments.length) {
                // Actualizar cuota existente
                const installment = unpaidInstallments[i];
                installment.installmentNumber = installmentNumber;
                installment.dueDate = dueDate;
                installment.principal = item.principal;
                installment.interest = item.interest;
                installment.totalPayment = item.total;
                installment.paid = false;
                installment.paymentDate = null;
                await loanAmortizationRepo.save(installment);
            } else {
                // Crear nueva cuota si no hay suficiente
                await loanAmortizationRepo.save(
                    loanAmortizationRepo.create({
                        loan,
                        loanId,
                        installmentNumber,
                        dueDate,
                        principal: item.principal,
                        interest: item.interest,
                        totalPayment: item.total,
                        paid: false,
                        paymentDate: null,
                    })
                );
            }
        }

        // Eliminar cuotas sobrantes si las hay
        if (unpaidInstallments.length > newAmortization.length) {
            const extraInstallments = unpaidInstallments.slice(newAmortization.length);
            await loanAmortizationRepo.remove(extraInstallments);
        }

        // Verificar si quedó todo pagado tras el recalculo
        const remainingBalanceAfter = await calculateRemainingBalance(
            loanId, loanRepo, loanAmortizationRepo, capitalPaymentRepo
        );

        // console.log('Saldo restante después del recalculo:', remainingBalanceAfter);

        if (remainingBalanceAfter <= 0) {
            await markAllPendingInstallmentsAsPaid(loanId, loanAmortizationRepo);
            loan.status = 'pagado';
            await loanRepo.save(loan);
        }

    } catch (error) {
        console.error('Error al recalcular amortización:', error);
        throw error;
    }
}

// Función utilitaria para marcar como pagadas las cuotas pendientes
async function markAllPendingInstallmentsAsPaid(
    loanId: number,
    loanAmortizationRepo: Repository<LoanAmortization>
) {
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
        return 0;
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
