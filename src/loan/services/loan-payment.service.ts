import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoanAmortization } from '@loan/entities/loan-amortization.entity';
import { LoanPayment } from '@loan/entities/loan-payment.entity';
import { calculateRemainingBalance } from '@loan/utils/recalculateAmortization.util';
import { PaymentDto } from '@loan/dto/payment.dto';
import { CapitalPayment } from '@loan/entities/capital-payment.entity';
import { Loan } from '@loan/entities/loan.entity';
import { LoanRepaymentService } from '@/loan/services/loan-repayment.service';
import { RepaymentResponse } from '@loan/types/repayment.interface';


@Injectable()
export class LoanPaymentService {
    constructor(
        @InjectRepository(Loan)
        private readonly loanRepo: Repository<Loan>,
        @InjectRepository(LoanAmortization)
        private readonly loanAmortizationRepo: Repository<LoanAmortization>,
        @InjectRepository(CapitalPayment)
        private readonly capitalPaymentRepo: Repository<CapitalPayment>,
        @InjectRepository(LoanPayment)
        private readonly loanPaymentRepo: Repository<LoanPayment>,
        private readonly loanRepaymentRepo: LoanRepaymentService,
    ) { }

    async registerPayment(dto: PaymentDto) {

        const { loanId, amountPaid } = dto;

        const loan = await this.loanRepo.findOne({ where: { id: loanId } });


        if (!loan) throw new NotFoundException('Préstamo no encontrado');

        if (['pagado'].includes(loan.status)) {
            throw new BadRequestException('El préstamo ya ha sido pagado');
        }
        if (loan.status !== 'aprobado') {
            throw new BadRequestException('El préstamo no está aprobado');
        }

        const lastPaid = await this.loanAmortizationRepo.findOne({
            where: { loanId, paid: true },
            order: { installmentNumber: 'DESC' },
        });

        console.log('Última cuota pagada:', lastPaid); //FIXME remove this line in production



        const nextInstallment = lastPaid ? (lastPaid.installmentNumber || 0) + 1 : 1;
        //console.log('Siguiente cuota:', nextInstallment); //FIXME remove this line in production
        const amortization = await this.loanAmortizationRepo.findOne({
            where: { loanId, installmentNumber: nextInstallment },
        });

        if (!amortization) {
            throw new NotFoundException('Cuota no encontrada');
        }

        if (amortization.paid) {
            throw new BadRequestException('Esta cuota ya ha sido pagada');
        }



        if (amountPaid < amortization.totalPayment) {
            throw new BadRequestException(`El monto pagado ($${amountPaid}) es menor que el total requerido ($${amortization.totalPayment})`);
        }


        const extra = amountPaid - amortization.totalPayment;

        // console.log('Monto extra:', extra);
        const remainBalance = await calculateRemainingBalance(
            loanId,
            this.loanRepo,
            this.loanAmortizationRepo,
            this.capitalPaymentRepo
        );
        console.log('Saldo restante:', remainBalance);
        if (extra > remainBalance) {
            throw new BadRequestException('El monto extra no puede ser mayor al saldo restante del préstamo');
        }

        // Marcar cuota como pagada
        amortization.paid = true;
        amortization.paymentDate = new Date();
        await this.loanAmortizationRepo.save(amortization);


        //TODO: Tipar el abono extra correctamente
        let repaymentResponse: RepaymentResponse = {
            amount: 0,
            message: '',
            remaining: 0,
            capitalPayment: 0,
        };
        if (extra > 0) {
            // console.log('Registrando abono extra:', extra); //FIXME remove this line in production
            repaymentResponse = await this.loanRepaymentRepo.applyRepaymentToLoan({

                loanId,
                amount: extra,
                description: nextInstallment ? 'Abono registrado de la cuota numero ' + nextInstallment : 'Abono registrado',
            });
        }


        const payment = this.loanPaymentRepo.create({
            loan: { id: loanId },
            isExtraPayment: extra > 0,
            amortization: { id: amortization.id },
            amountPaid,
            paymentDate: new Date(),
        });

        await this.loanPaymentRepo.save(payment);

        const remainingBalance = await calculateRemainingBalance(
            loanId, this.loanRepo, this.loanAmortizationRepo, this.capitalPaymentRepo
        );
        // console.log('Saldo restante después del pago:', remainingBalance); //FIXME remove this line in production
        if (remainingBalance <= 0) {
            console.log('Préstamo pagado completamente'); //FIXME remove this line in production
            await this.loanRepo.update(loanId, { status: 'pagado' });

        }



        const updatedLoan = await this.loanRepo.findOne({ where: { id: loanId } });

        return {
            message: 'Pago registrado correctamente',
            remainingBalance,
            loanStatus: updatedLoan?.status || loan?.status,
            extraPayment: extra > 0 ? {
                amount: extra.toFixed(2),
                ...repaymentResponse,
            } : null,
        };

    }



}
