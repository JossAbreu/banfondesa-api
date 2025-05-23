import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Loan } from '@loan/entities/loan.entity';
import { LoanApproval } from '@loan/entities/loan-approval.entity';
import { LoanAmortization } from '@loan/entities/loan-amortization.entity';
import { ApproveLoanDto } from '@loan/dto/approve-loan.dto';
import { generateAmortization } from '@loan/utils/generateAmortization.util';
import { calculateDueDate } from '@loan/utils/calculateDueDate.util';

@Injectable()
export class LoanAprovalOrRejectService {
    constructor(
        @InjectRepository(Loan)
        private readonly loanRepo: Repository<Loan>,
        @InjectRepository(LoanApproval)
        private readonly loanApprovalRepo: Repository<LoanApproval>,
        @InjectRepository(LoanAmortization)
        private readonly loanAmortizationRepo: Repository<LoanAmortization>,

    ) { }

    async approveOrReject(dto: ApproveLoanDto) {
        const loan = await this.loanRepo.findOne({ where: { id: dto.loanId } });

        if (!loan) throw new NotFoundException('Préstamo no encontrado');

        if (loan.status !== 'pendiente') {
            throw new BadRequestException('El préstamo ya ha sido procesado');
        }

        if (dto.approve) {

            const interest = dto.interestRate || loan.interestRate;
            loan.status = 'aprobado';
            loan.approvedAt = new Date();
            loan.interestRate = interest; // Asigna la tasa de interés si no está definida

            await this.loanRepo.save(loan);

            const amortization = generateAmortization(
                loan.amount,
                loan.termMonths,
                loan.interestRate,
                loan.amortizationType as 'fija' | 'variable',
            );

            const startDate = new Date();


            // Guardar la aprobación del préstamo
            const approval = this.loanApprovalRepo.create({
                loan,
                approved: true,
                decisionDate: new Date(),
                reviewerName: dto.reviewerName,
                comment: dto.comment,
            });

            await this.loanApprovalRepo.save(approval);

            for (const item of amortization) {
                await this.loanAmortizationRepo.save({
                    loanId: loan.id,
                    installmentNumber: item.installment,
                    dueDate: calculateDueDate(startDate, item.installment),
                    principal: item.principal,
                    interest: item.interest,
                    totalPayment: item.total,
                    paid: false,
                    paymentDate: null
                });
            }
        } else {
            loan.status = 'rechazado';
            await this.loanRepo.save(loan);
        }

        return {
            message: `Préstamo ${dto.approve ? 'aprobado' : 'rechazado'} correctamente`,
        };
    }



}
