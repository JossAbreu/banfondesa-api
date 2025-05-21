
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Loan } from '@loan/entities/loan.entity';

@Entity('payments')
export class Payment {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    amount: number;

    @Column({ type: 'date' })
    paymentDate: Date;

    @Column({ default: false })
    isCapitalAbono: boolean;

    @ManyToOne(() => Loan, loan => loan.payments)
    loan: Loan;
}
