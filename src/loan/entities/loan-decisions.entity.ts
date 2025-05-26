// src/entities/loan-decisions.entity.ts

import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
    JoinColumn
} from 'typeorm';
import { Loan } from '@loan/entities/loan.entity';

@Entity('loan_decisions')
export class LoanDecisions {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Loan, (loan) => loan.decisions, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'loanId' })
    loan: Loan;


    @Column()
    approved: boolean;

    @CreateDateColumn()
    decisionDate: Date;

    @Column({ nullable: true })
    reviewerName: string;

    @Column({ type: 'text', nullable: true })
    comment: string;
}
