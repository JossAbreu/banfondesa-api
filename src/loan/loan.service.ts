import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Loan } from './entities/loan.entity';
import { CreateLoanDto } from './dto/create-loan.dto';
import { ApproveLoanDto } from './dto/approve-loan.dto';
import { AmortizationDto } from './dto/amortization.dto';
import { PaymentDto } from './dto/payment.dto';
import { AbonoDto } from './dto/abono.dto';
import { User } from 'src/user/entities/user.entity';
import { GetUser } from '@/auth/decorators/get-user.decorator';


@Injectable()
export class LoanService {
    constructor(
        @InjectRepository(Loan)
        private readonly loanRepo: Repository<Loan>,
    ) { }

    async create(dto: CreateLoanDto, @GetUser() user: User): Promise<Loan> {
        console.log('🧾 Creating loan for user:', user?.id);
        const loan = this.loanRepo.create({
            amount: dto.amount,
            termMonths: dto.termMonths,
            interestRate: dto.interestRate,
            amortizationType: dto.amortizationType,
            user,
        });

        return this.loanRepo.save(loan);
    }

    async findAll() {
        return {
            message: 'Lista de préstamos',
            loans: await this.loanRepo.find()
        };
    }

    async findOneWithoutAmortization(id: number) {
        const loan = await this.loanRepo.findOne({ where: { id } });

        if (!loan) {
            throw new NotFoundException('Préstamo no encontrado');
        }

        return loan;
    }

    async findOneWithAmortization(id: number) {
        const loan = await this.findOneWithoutAmortization(id);

        const amortization = this.generateAmortization(
            loan.amount,
            loan.termMonths,
            loan.interestRate,
            loan.amortizationType,
        );

        return {
            ...loan,
            amortization,
        };
    }

    // async approveOrReject(dto: ApproveLoanDto) {
    //     const loan = await this.loanRepo.findOne({ where: { id: dto.loanId } });

    //     if (!loan) {
    //         throw new NotFoundException('Préstamo no encontrado');
    //     }

    //     loan.status = dto.status;
    //     return this.loanRepo.save(loan);
    // }

    private generateAmortization(
        amount: number,
        term: number,
        interest: number,
        type: 'fija' | 'variable',
    ) {
        const monthlyRate = interest / 12;
        type AmortizationEntry = {
            installment: number;
            principal: number;
            interest: number;
            total: number;
            balance: number;
        };
        const amortization: AmortizationEntry[] = [];

        if (type === 'fija') {
            const monthlyPayment = (amount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -term));

            for (let i = 1; i <= term; i++) {
                const interestPayment = amount * monthlyRate;
                const principalPayment = monthlyPayment - interestPayment;
                amount -= principalPayment;

                amortization.push({
                    installment: i,
                    principal: Number(principalPayment.toFixed(2)),
                    interest: Number(interestPayment.toFixed(2)),
                    total: Number(monthlyPayment.toFixed(2)),
                    balance: Number(Math.max(amount, 0).toFixed(2)),
                });
            }
        }

        if (type === 'variable') {
            const fixedPrincipal = amount / term;
            let remainingBalance = amount;

            for (let i = 1; i <= term; i++) {
                const interestPayment = remainingBalance * monthlyRate;
                const totalPayment = fixedPrincipal + interestPayment;
                remainingBalance -= fixedPrincipal;

                amortization.push({
                    installment: i,
                    principal: Number(fixedPrincipal.toFixed(2)),
                    interest: Number(interestPayment.toFixed(2)),
                    total: Number(totalPayment.toFixed(2)),
                    balance: Number(Math.max(remainingBalance, 0).toFixed(2)),
                });
            }
        }

        return amortization;
    }


    //     // Para amortización "variable", podrías implementar otra lógica.

    //     return amortization;
    // }

    // async registerPayment(dto: PaymentDto) {
    //     const loan = await this.loanRepo.findOne({ where: { id: dto.loanId } });

    //     if (!loan) throw new NotFoundException('Préstamo no encontrado');

    //     if (dto.amount > loan.pendingBalance) {
    //         throw new BadRequestException('El monto supera el saldo pendiente');
    //     }

    //     loan.pendingBalance -= dto.amount;

    //     return this.loanRepo.save(loan);
    // }

    // async registerAbono(dto: AbonoDto) {
    //     const loan = await this.loanRepo.findOne({ where: { id: dto.loanId } });

    //     if (!loan) throw new NotFoundException('Préstamo no encontrado');

    //     loan.pendingBalance -= dto.amount;

    //     return this.loanRepo.save(loan);
    // }
}
