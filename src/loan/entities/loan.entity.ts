// src/entities/loan.entity.ts

import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { User } from '@user/entities/user.entity';
import { LoanAmortization } from '@/loan/entities/loan-amortization.entity';
import { LoanPayment } from '@loan/entities/loan-payment.entity';
import { CapitalPayment } from '@loan/entities/capital-payment.entity';
import { LoanApproval } from '@loan/entities/loan-approval.entity';

export type LoanStatus = 'pendiente' | 'aprobado' | 'rechazado' | 'pagado';

@Entity('loans')
export class Loan {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, (user) => user.loans, { eager: true })
    user: User;

    @Column({ type: 'numeric', precision: 12, scale: 2 })
    amount: number;

    @Column()
    termMonths: number;

    @Column({ type: 'numeric', precision: 5, scale: 2 })
    interestRate: number;

    @Column({
        type: 'varchar',
        length: 20,
    })
    amortizationType: 'fija' | 'variable';

    @Column({
        type: 'varchar',
        length: 20,
        default: 'pendiente',
    })
    status: LoanStatus;

    @CreateDateColumn()
    createdAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    approvedAt: Date;

    @OneToMany(() => LoanAmortization, (amort) => amort.loan)
    amortizations: LoanAmortization[];

    @OneToMany(() => LoanPayment, (payment) => payment.loan)
    payments: LoanPayment[];

    @OneToMany(() => CapitalPayment, (abono) => abono.loan)
    capitalPayments: CapitalPayment[];

    @OneToMany(() => LoanApproval, (approval) => approval.loan)
    approvals: LoanApproval[];
}
