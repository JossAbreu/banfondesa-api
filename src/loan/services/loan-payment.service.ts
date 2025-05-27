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
import { LoanAbonoService } from '@loan/services/loan-abono.service';
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
        private readonly loanAbonoService: LoanAbonoService,
    ) { }

    async registerPayment(dto: PaymentDto) {

        const { loanId, installmentNumber, amountPaid } = dto;

        const loan = await this.loanRepo.findOne({ where: { id: loanId } });
        if (!loan) throw new NotFoundException('Préstamo no encontrado');

        if (['pagado'].includes(loan.status)) {
            throw new BadRequestException('El préstamo ya ha sido pagado');
        }
        if (loan.status !== 'aprobado') {
            throw new BadRequestException('El préstamo no está aprobado');
        }

        const amortization = await this.loanAmortizationRepo.findOne({
            where: { loanId, installmentNumber },
        });

        if (!amortization) {
            throw new NotFoundException('Cuota no encontrada');
        }

        if (amortization.paid) {
            throw new BadRequestException('Esta cuota ya ha sido pagada');
        }

        const lastPaid = await this.loanAmortizationRepo.findOne({
            where: { loanId, paid: true },
            order: { installmentNumber: 'DESC' },
        });

        const expectedInstallment = (lastPaid?.installmentNumber || 0) + 1;

        if (installmentNumber !== expectedInstallment) {
            throw new BadRequestException(`El número de cuota a pagar (${installmentNumber}) no corresponde al siguiente pago (${expectedInstallment})`);
        }

        if (amountPaid < amortization.totalPayment) {
            throw new BadRequestException(`El monto pagado ($${amountPaid}) es menor que el total requerido ($${amortization.totalPayment})`);
        }


        // Marcar cuota como pagada
        amortization.paid = true;
        amortization.paymentDate = new Date();
        await this.loanAmortizationRepo.save(amortization);



        const extra = amountPaid - amortization.totalPayment;

        // console.log('Monto extra:', extra);
        const remainBalance = await calculateRemainingBalance(
            loanId,
            this.loanRepo,
            this.loanAmortizationRepo,
            this.capitalPaymentRepo
        );
        //console.log('Saldo restante:', remainBalance);
        if (extra > remainBalance) {
            throw new BadRequestException('El monto extra no puede ser mayor al saldo restante del préstamo');
        }

        let abono;
        if (extra > 0) {
            console.log('Registrando abono extra:', extra);
            abono = await this.loanAbonoService.registerAbono({
                loanId,
                amount: extra,
                description: installmentNumber ? 'Abono registrado de la cuota numero ' + installmentNumber : 'Abono registrado',
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


        return {
            message: 'Pago registrado correctamente',
            extraPayment: extra > 0 ? extra.toFixed(2) : 0,
            remainingBalance: await calculateRemainingBalance(loanId, this.loanRepo, this.loanAmortizationRepo, this.capitalPaymentRepo),
            loanStatus: loan.status,
            abonoDetails: extra > 0 ? {
                message: 'Abono extra registrado correctamente',
                details: abono,
            } : null,
        };
    }



}
