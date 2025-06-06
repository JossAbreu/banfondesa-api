import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoanAmortization } from '@loan/entities/loan-amortization.entity';
import { recalculateAmortization, calculateRemainingBalance } from '@loan/utils/recalculateAmortization.util';
import { RepaymentDto } from '@/loan/dto/v1.0/repayment.dto';
import { CapitalPayment } from '@loan/entities/capital-payment.entity';
import { Loan } from '@loan/entities/loan.entity';

@Injectable()
export class LoanRepaymentService {
    constructor(
        @InjectRepository(Loan)
        private readonly loanRepo: Repository<Loan>,
        @InjectRepository(LoanAmortization)
        private readonly loanAmortizationRepo: Repository<LoanAmortization>,
        @InjectRepository(CapitalPayment)
        private readonly capitalPaymentRepo: Repository<CapitalPayment>,

    ) { }

    async applyRepaymentToLoan(dto: RepaymentDto) {

        //verifico si el préstamo existe y no hay cuotas pendientes
        const loan = await this.loanRepo.findOne({ where: { id: dto.loanId } });
        if (!loan) throw new NotFoundException('Préstamo no encontrado');

        const capitalPayment = this.capitalPaymentRepo.create({
            loan,
            amount: dto.amount,
            description: dto.description || 'Abono registrado',
        });
        await this.capitalPaymentRepo.save(capitalPayment);

        // Recalcular la amortización del préstamo
        await recalculateAmortization(loan.id, this.loanRepo, this.loanAmortizationRepo, this.capitalPaymentRepo);

        return {
            message: dto.description || 'Abono registrado exitosamente',
            remaining: await calculateRemainingBalance(loan.id, this.loanRepo, this.loanAmortizationRepo, this.capitalPaymentRepo),
            capitalPayment: capitalPayment.amount,
        };
    }


}
