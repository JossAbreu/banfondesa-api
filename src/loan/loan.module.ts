//src/loan/loan.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Loan } from '@loan/entities/loan.entity';
import { LoanAmortization } from '@/loan/entities/loan-amortization.entity';
import { LoanPayment } from '@loan/entities/loan-payment.entity';
import { CapitalPayment } from '@loan/entities/capital-payment.entity';
import { LoanDecisions } from '@/loan/entities/loan-decisions.entity';
import { LoanService } from '@loan/loan.service';
import { LoanAprovalOrRejectService } from '@/loan/services/loan-aproval-or-reject.service'
import { LoanCreationService } from '@loan/services/loan-creation.service';
import { LoanPaymentService } from '@loan/services/loan-payment.service';
import { LoanRepaymentService } from '@/loan/services/loan-repayment.service';
import { V1LoanController } from '@/loan/controllers/v1/loan.controller';
import { V2LoanController } from '@/loan/controllers/v2/loan.controller';
import { Client } from '@client/entities/clients.entity';



@Module({
    imports: [TypeOrmModule.forFeature([Loan, Client, CapitalPayment, LoanAmortization, LoanPayment, LoanDecisions])],
    controllers: [V1LoanController, V2LoanController],
    providers: [LoanService, LoanAprovalOrRejectService, LoanCreationService, LoanPaymentService, LoanRepaymentService],
    exports: [LoanService, TypeOrmModule],
})
export class LoanModule { }
