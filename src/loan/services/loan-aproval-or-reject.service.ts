import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Loan } from '@loan/entities/loan.entity';
import { LoanDecisions } from '@loan/entities/loan-decisions.entity';
import { LoanAmortization } from '@loan/entities/loan-amortization.entity';
import { ApproveOrRejectLoanDto } from '@loan/dto/approve-or-reject-loan.dto';
import { generateAmortization } from '@loan/utils/generateAmortization.util';
import { calculateDueDate } from '@loan/utils/calculateDueDate.util';
import { updateStatusLoan } from '@loan/utils/update.status.loan';


@Injectable()
export class LoanAprovalOrRejectService {
    constructor(
        @InjectRepository(Loan)
        private readonly loanRepo: Repository<Loan>,
        @InjectRepository(LoanDecisions)
        private readonly loanDecisionsRepo: Repository<LoanDecisions>,
        @InjectRepository(LoanAmortization)
        private readonly loanAmortizationRepo: Repository<LoanAmortization>,

    ) { }

    async approveOrReject(dto: ApproveOrRejectLoanDto) {
        const loan = await this.loanRepo.findOne({ where: { id: dto.loanId } });

        if (!loan) throw new NotFoundException('Préstamo no encontrado');

        if (loan.status !== 'pendiente') {
            throw new BadRequestException('El préstamo ya ha sido procesado');
        }

        //validar si tiene una desición previa
        const previousDecision = await this.loanDecisionsRepo.findOne({ where: { loan: { id: dto.loanId } } });
        if (previousDecision) {
            throw new BadRequestException('El préstamo ya tiene una decisión previa');
        }


        if (dto.approve) {

            const interest = dto.interestRate || loan.interestRate;
            loan.status = 'aprobado';
            loan.approvedAt = new Date();
            loan.interestRate = interest;

            await this.loanRepo.save(loan);

            const amortization = generateAmortization(
                loan.amount,
                loan.termMonths,
                loan.interestRate,
                loan.amortizationType as 'fija' | 'variable',
            );

            const startDate = new Date();



            const decision = this.loanDecisionsRepo.create({
                loan,
                approved: true,
                decisionDate: new Date(),
                reviewerName: dto.reviewerName,
                comment: dto.comment,
            });



            await this.loanDecisionsRepo.save(decision);

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

            const decision = this.loanDecisionsRepo.create({
                loan,
                approved: false,
                decisionDate: new Date(),
                reviewerName: dto.reviewerName,
                comment: dto.comment,
            });

            await this.loanDecisionsRepo.save(decision);
        }

        return {
            message: `Préstamo ${dto.approve ? 'aprobado' : 'rechazado'} correctamente`,
        };
    }



}
