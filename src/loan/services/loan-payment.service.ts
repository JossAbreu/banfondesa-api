import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoanAmortization } from '@loan/entities/loan-amortization.entity';
import { recalculateAmortization, calculateRemainingBalance } from '@loan/utils/recalculateAmortization.util';
import { PaymentDto } from '@loan/dto/payment.dto';
import { CapitalPayment } from '@loan/entities/capital-payment.entity';
import { Loan } from '@loan/entities/loan.entity';

@Injectable()
export class LoanPaymentService {
    constructor(
        @InjectRepository(Loan)
        private readonly loanRepo: Repository<Loan>,
        @InjectRepository(LoanAmortization)
        private readonly loanAmortizationRepo: Repository<LoanAmortization>,
        @InjectRepository(CapitalPayment)
        private readonly capitalPaymentRepo: Repository<CapitalPayment>,

    ) { }

    async registerPayment(dto: PaymentDto) {
        const amortization = await this.loanAmortizationRepo.findOne({
            where: {
                loanId: dto.loanId,
                installmentNumber: dto.installmentNumber,
            },
        });

        if (!amortization) {
            throw new NotFoundException('Cuota no encontrada');
        }

        if (amortization.paid) {
            throw new BadRequestException('Esta cuota ya ha sido pagada');
        }

        // validar que no se dupliquen los pagos
        const existingPayment = await this.loanAmortizationRepo.findOne({
            where: {
                loanId: dto.loanId,
                installmentNumber: dto.installmentNumber,
                paid: true,
            },
        });

        if (existingPayment) {
            throw new BadRequestException('Ya existe un pago registrado para esta cuota');
        }


        // Validar que el número de cuota corresponda al orden de pago
        const lastPaidInstallment = await this.loanAmortizationRepo.findOne({
            where: {
                loanId: dto.loanId,
                paid: true,
            },
            order: {
                installmentNumber: 'DESC',
            },
        }) || { installmentNumber: 0 };


        const nextPayment = lastPaidInstallment.installmentNumber + 1;
        console.log('nextPayment', nextPayment);
        if (dto.installmentNumber !== nextPayment) {
            throw new BadRequestException(
                `El número de cuota a pagar (${dto.installmentNumber}) no corresponde al siguiente pago (${nextPayment})`,
            );
        }

        // Validar que el monto sea suficiente
        if (dto.amountPaid < amortization.totalPayment) {
            throw new BadRequestException(
                `El monto pagado ($${dto.amountPaid}) es menor que el total requerido ($${amortization.totalPayment})`,
            );
        }

        const extra = dto.amountPaid - amortization.totalPayment;

        // Marcar la cuota como pagada
        amortization.paid = true;
        amortization.paymentDate = new Date();

        await this.loanAmortizationRepo.save(amortization);

        // ✅ Si hay monto extra, registrar abono al capital
        if (extra > 0) {
            const capitalPayment = this.capitalPaymentRepo.create({
                loan: { id: amortization.loanId },
                amount: extra,
                paymentDate: new Date(),
                description: `Abono extra del pago de la cuota #${dto.installmentNumber}`,
            });
            await this.capitalPaymentRepo.save(capitalPayment);

            // 🧠 Reducir el capital del préstamo y recalcular cuotas
            await recalculateAmortization(dto.loanId, this.loanRepo, this.loanAmortizationRepo, this.capitalPaymentRepo);
        }



        return {
            message: 'Pago registrado correctamente',
            extraPayment: extra > 0 ? extra.toFixed(2) : 0,
            remainingBalance: await calculateRemainingBalance(dto.loanId, this.loanRepo, this.loanAmortizationRepo, this.capitalPaymentRepo),
        };
    }


}
