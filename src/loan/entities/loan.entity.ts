// src/entities/loan.entity.ts
import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    OneToMany,
    CreateDateColumn,
    JoinColumn,
} from 'typeorm';
import { Client } from '@client/entities/clients.entity';
import { LoanAmortization } from '@/loan/entities/loan-amortization.entity';
import { LoanPayment } from '@loan/entities/loan-payment.entity';
import { CapitalPayment } from '@loan/entities/capital-payment.entity';
import { LoanDecisions } from '@/loan/entities/loan-decisions.entity';

export type LoanStatus = 'pendiente' | 'aprobado' | 'rechazado' | 'pagado';

@Entity('loans')
export class Loan {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Client, (client) => client.loans, { eager: true })
    @JoinColumn({ name: 'clientId' })
    client: Client;

    @Column()
    clientId: number;

    @Column({ type: 'numeric', precision: 12, scale: 2 })
    amount: number;

    @Column()
    termMonths: number;

    @Column({ type: 'numeric', precision: 5, scale: 2 })
    interestRate: number;

    @Column({ type: 'varchar', length: 20 })
    amortizationType: 'fija' | 'variable';

    @Column({ type: 'varchar', length: 20, default: 'pendiente' })
    status: LoanStatus;

    @CreateDateColumn()
    createdAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    approvedAt: Date;

    @OneToMany(() => LoanAmortization, (amort) => amort.loan, { eager: true })
    @JoinColumn({ name: 'loanId' })
    amortizations: LoanAmortization[];

    @OneToMany(() => LoanPayment, (payment) => payment.loan, { eager: true })
    payments: LoanPayment[];

    @OneToMany(() => CapitalPayment, (abono) => abono.loan, { eager: true })
    capitalPayments: CapitalPayment[];

    @OneToMany(() => LoanDecisions, (decision) => decision.loan, { eager: true })
    decisions: LoanDecisions[];


}
