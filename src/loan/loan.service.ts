import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Loan } from './entities/loan.entity';
import { CreateLoanDto } from './dto/create-loan.dto';
import { ApproveLoanDto } from './dto/approve-loan.dto';
import { AmortizationDto } from './dto/amortization.dto';
import { PaymentDto } from './dto/payment.dto';
import { AbonoDto } from './dto/abono.dto';
import { User } from 'src/user/entities/user.entity';
import { LoanAmortization } from './entities/loan-amortization.entity'; // Asegúrate de importar esto correctamente
import { Client } from '@/clients/entities/clients.entity';

@Injectable()
export class LoanService {
    constructor(
        @InjectRepository(Loan)
        private readonly loanRepo: Repository<Loan>,
        @InjectRepository(Client)
        private readonly clientRepo: Repository<Client>,

        @InjectRepository(LoanAmortization)
        private readonly loanAmortizationRepo: Repository<LoanAmortization>,
    ) { }

    async create(dto: CreateLoanDto): Promise<Loan> {
        const client = await this.clientRepo.findOne({ where: { id: dto.clientId } });
        if (!client) {
            throw new NotFoundException('Cliente no encontrado');
        }

        // Verifica si el cliente ya tiene un préstamo pendiente
        const existingLoan = await this.loanRepo.findOne({
            where: { clientId: dto.clientId, status: 'pendiente' },
        });
        if (existingLoan) {
            throw new BadRequestException('El cliente ya tiene un préstamo pendiente');
        }


        const loan = this.loanRepo.create({
            amount: dto.amount,
            termMonths: dto.termMonths,
            interestRate: dto.interestRate,
            amortizationType: dto.amortizationType,
            clientId: dto.clientId,
        });

        return this.loanRepo.save(loan);
    }

    async findAll() {
        return {
            message: 'Lista de préstamos',
            loans: await this.loanRepo.find(),
        };
    }

    async findOneWithoutAmortization(id: number) {
        const loan = await this.loanRepo.findOne({ where: { id } });

        if (!loan) throw new NotFoundException('Préstamo no encontrado');

        return loan;
    }

    async findOneWithAmortization(id: number) {
        const loan = await this.findOneWithoutAmortization(id);

        const amortization = this.generateAmortization(
            loan.amount,
            loan.termMonths,
            loan.interestRate,
            loan.amortizationType as 'fija' | 'variable',
        );

        return {
            ...loan,
            amortization,
        };
    }

    async approveOrReject(dto: ApproveLoanDto) {
        const loan = await this.loanRepo.findOne({ where: { id: dto.loanId } });

        if (!loan) throw new NotFoundException('Préstamo no encontrado');

        if (loan.status !== 'pendiente') {
            throw new BadRequestException('El préstamo ya ha sido procesado');
        }
        if (dto.approve) {
            if (dto.interestRate === undefined) {
                throw new BadRequestException('La tasa de interés es obligatoria al aprobar el préstamo');
            }
            loan.status = 'aprobado';
            loan.approvedAt = new Date();
            loan.interestRate = dto.interestRate;

            await this.loanRepo.save(loan);

            const amortization = this.generateAmortization(
                loan.amount,
                loan.termMonths,
                loan.interestRate,
                loan.amortizationType as 'fija' | 'variable',
            );

            const startDate = new Date();

            for (const item of amortization) {
                await this.loanAmortizationRepo.save({
                    loanId: loan.id,
                    installmentNumber: item.installment,
                    dueDate: this.calculateDueDate(startDate, item.installment),
                    principal: item.principal,
                    interest: item.interest,
                    totalPayment: item.total,
                    paid: false,
                    paymentDate: null
                });
            }
        } else {
            loan.status = 'rechazado';
            await this.loanRepo.save(loan);
        }

        return {
            message: `Préstamo ${dto.approve ? 'aprobado' : 'rechazado'} correctamente`,
        };
    }

    private generateAmortization(
        amount: number,
        term: number,
        interest: number,
        type: 'fija' | 'variable',
    ) {
        const monthlyRate = interest / 12; // CORREGIDO: de % a decimal
        type AmortizationEntry = {
            installment: number;
            principal: number;
            interest: number;
            total: number;
            balance: number;
        };
        const amortization: AmortizationEntry[] = [];

        if (type === 'fija') {
            const monthlyPayment =
                (amount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -term));
            let balance = amount;

            for (let i = 1; i <= term; i++) {
                const interestPayment = balance * monthlyRate;
                const principalPayment = monthlyPayment - interestPayment;
                balance -= principalPayment;

                amortization.push({
                    installment: i,
                    principal: Number(principalPayment.toFixed(2)),
                    interest: Number(interestPayment.toFixed(2)),
                    total: Number(monthlyPayment.toFixed(2)),
                    balance: Number(Math.max(balance, 0).toFixed(2)),
                });
            }
        } else {
            const fixedPrincipal = amount / term;
            let balance = amount;

            for (let i = 1; i <= term; i++) {
                const interestPayment = balance * monthlyRate;
                const totalPayment = fixedPrincipal + interestPayment;
                balance -= fixedPrincipal;

                amortization.push({
                    installment: i,
                    principal: Number(fixedPrincipal.toFixed(2)),
                    interest: Number(interestPayment.toFixed(2)),
                    total: Number(totalPayment.toFixed(2)),
                    balance: Number(Math.max(balance, 0).toFixed(2)),
                });
            }
        }

        return amortization;
    }

    // Método para calcular la fecha de vencimiento
    private calculateDueDate(startDate: Date, installmentNumber: number): Date {
        const due = new Date(startDate);
        due.setMonth(due.getMonth() + installmentNumber);
        return due;
    }

    async calculateAmortization(dto: AmortizationDto) {
        const { amount, termMonths, interestRate, amortizationType } = dto;

        if (amount <= 0 || termMonths <= 0 || interestRate < 0) {
            throw new BadRequestException('Parámetros inválidos');
        }

        const amortization = this.generateAmortization(
            amount,
            termMonths,
            interestRate,
            amortizationType,
        );

        return {
            message: 'Amortización calculada exitosamente',
            amortizationSchedule: amortization,
        };
    }
    // Puedes completar estos métodos después si los necesitas
    // async registerPayment(dto: PaymentDto) { ... }

    // async registerAbono(dto: AbonoDto) { ... }
}
