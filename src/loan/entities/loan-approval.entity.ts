// src/entities/loan-approval.entity.ts

import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    CreateDateColumn,
} from 'typeorm';
import { Loan } from '@loan/entities/loan.entity';

@Entity('loan_approvals')
export class LoanApproval {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Loan, (loan) => loan.approvals, { onDelete: 'CASCADE' })
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
