// src/entities/loan-amortization.entity.ts

import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn
} from 'typeorm';
import { Loan } from './loan.entity';

@Entity('loan_amortizations')
export class LoanAmortization {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    installmentNumber: number;

    @Column()
    dueDate: Date;

    @Column('decimal')
    principal: number;

    @Column('decimal')
    interest: number;

    @Column('decimal')
    totalPayment: number;

    @Column({ default: false })
    paid: boolean;

    @Column({ type: 'timestamp', nullable: true })
    paymentDate: Date | null;

    @ManyToOne(() => Loan, (loan) => loan.amortizations, { nullable: false })
    @JoinColumn({ name: 'loanId' })
    loan: Loan;

    @Column()
    loanId: number;
}