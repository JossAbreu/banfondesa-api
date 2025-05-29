// src/entities/loan-payment.entity.ts

import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
} from 'typeorm';
import { Loan } from '@loan/entities/loan.entity';
import { LoanAmortization } from '@loan/entities/loan-amortization.entity';

@Entity('loan_payments')
export class LoanPayment {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Loan, (loan) => loan.payments, { onDelete: 'CASCADE' })
    loan: Loan;

    @ManyToOne(() => LoanAmortization, { nullable: true })
    amortization: LoanAmortization;

    @Column({ type: 'numeric', precision: 12, scale: 2 })
    amountPaid: number;

    @Column({ type: 'date', default: () => 'CURRENT_DATE' })
    paymentDate: Date;

    @Column({ default: false })
    isExtraPayment: boolean;
}
