//src/loan/loan.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Loan } from './entities/loan.entity';
import { LoanAmortization } from '@/loan/entities/loan-amortization.entity';
import { LoanPayment } from '@loan/entities/loan-payment.entity';
import { CapitalPayment } from '@loan/entities/capital-payment.entity';
import { LoanApproval } from '@loan/entities/loan-approval.entity';
import { LoanService } from '@loan/loan.service';
import { LoanAprovalOrRejectService } from '@loan/services/loan-aproval.service';
import { LoanCreationService } from '@loan/services/loan-creation.service';
import { LoanPaymentService } from '@loan/services/loan-payment.service';
import { LoanController } from './loan.controller';

// Importa el módulo de pagos si es necesario
import { Client } from '@client/entities/clients.entity'; // Importa el módulo de pagos si es necesario



@Module({
    imports: [TypeOrmModule.forFeature([Loan, Client, CapitalPayment, LoanAmortization, LoanPayment, LoanApproval])],
    controllers: [LoanController],
    providers: [LoanService, LoanAprovalOrRejectService, LoanCreationService, LoanPaymentService],
    exports: [LoanService, TypeOrmModule],
})
export class LoanModule { }
