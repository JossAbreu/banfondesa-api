// src/entities/capital-payment.entity.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Loan } from '@loan/entities/loan.entity';

@Entity('capital_payments')
export class CapitalPayment {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Loan, (loan) => loan.capitalPayments, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'loanId' })
    loan: Loan;

    @Column()
    loanId: number;

    @Column({ type: 'numeric', precision: 12, scale: 2 })
    amount: number;

    @Column({ type: 'date', default: () => 'CURRENT_DATE' })
    paymentDate: Date;

    @Column({ type: 'text', nullable: true })
    description: string;
}
