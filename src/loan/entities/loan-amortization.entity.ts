// src/entities/loan-amortization.entity.ts

import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
} from 'typeorm';
import { Loan } from './loan.entity';

@Entity('loan_amortizations')
export class LoanAmortization {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Loan, (loan) => loan.amortizations, { onDelete: 'CASCADE' })
    loan: Loan;

    @Column()
    installmentNumber: number;

    @Column({ type: 'date' })
    dueDate: Date;

    @Column({ type: 'numeric', precision: 12, scale: 2 })
    principal: number;

    @Column({ type: 'numeric', precision: 12, scale: 2 })
    interest: number;

    @Column({ type: 'numeric', precision: 12, scale: 2 })
    totalPayment: number;

    @Column({ default: false })
    paid: boolean;

    @Column({ type: 'date', nullable: true })
    paymentDate: Date | null;
}
