import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Loan } from './entities/loan.entity';
import { CreateLoanDto } from './dto/create-loan.dto';
import { ApproveOrRejectLoanDto } from './dto/approve-or-reject-loan.dto';
import { AmortizationDto } from './dto/amortization.dto';
import { PaymentDto } from './dto/payment.dto';
import { RepaymentDto } from './dto/repayment.dto';
import { LoanAmortization } from './entities/loan-amortization.entity'; // 
import { CapitalPayment } from './entities/capital-payment.entity';
import { LoanDecisions } from './entities/loan-decisions.entity';
import { Client } from '@/clients/entities/clients.entity';
import { LoanCreationService } from '@loan/services/loan-creation.service';
import { LoanAprovalOrRejectService } from '@/loan/services/loan-aproval-or-reject.service';
import { generateAmortization } from "@/loan/utils/generateAmortization.util"
import { LoanPaymentService } from '@loan/services/loan-payment.service';
import { LoanRepaymentService } from '@/loan/services/loan-repayment.service';

@Injectable()
export class LoanService {
    constructor(
        @InjectRepository(Loan)
        private readonly loanRepo: Repository<Loan>,
        private readonly loanCreation: LoanCreationService,
        private readonly loanApprovalOrRejectRepo: LoanAprovalOrRejectService,
        private readonly loanPaymentRepo: LoanPaymentService,
        private readonly loanRepaymentRepo: LoanRepaymentService,
    ) { }
    //metodo para crear un préstamo
    async create(dto: CreateLoanDto) {
        return this.loanCreation.create(dto);
    }
    //metodo para listar todos los préstamos
    async findAll() {
        return {
            message: 'Lista de préstamos',
            loans: await this.loanRepo.find(),
        };
    }
    //metodo para listar todos los préstamos de un cliente
    async findOneWithoutAmortization(id: number) {
        const loan = await this.loanRepo.findOne({ where: { id } });

        if (!loan) throw new NotFoundException('Préstamo no encontrado');

        return loan;
    }
    //metodo para buscar un prestamo con amortizacion
    async findOneWithAmortization(id: number) {
        const loan = await this.findOneWithoutAmortization(id);

        const amount = Number(loan.amount);
        const annualRate = Number(loan.interestRate);
        const months = loan.termMonths;

        const monthlyRate = annualRate / 12;

        // Cálculo de la cuota mensual fija (sistema francés)
        const monthlyPayment =
            (amount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -months));

        const totalToPay = monthlyPayment * months;
        const totalInterest = totalToPay - amount;

        const amortization = generateAmortization(
            amount,
            months,
            annualRate,
            loan.amortizationType as 'fija' | 'variable',
        );

        return {
            ...loan,
            amortization,
            interestAmount: totalInterest,
            monthlyPayment,
            totalAmount: totalToPay,
        };
    }

    //metodo para aprobar o rechazar un préstamo
    async approveOrReject(dto: ApproveOrRejectLoanDto) {
        return this.loanApprovalOrRejectRepo.approveOrReject(dto);
    }


    // Método para calcular la amortización
    async calculateAmortization(dto: AmortizationDto) {
        const { amount, termMonths, interestRate, amortizationType } = dto;

        if (amount <= 0 || termMonths <= 0 || interestRate < 0) {
            throw new BadRequestException('Parámetros inválidos');
        }

        const amortization = await generateAmortization(
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
    async registerPayment(dto: PaymentDto) {
        return this.loanPaymentRepo.registerPayment(dto);
    }




    //funcion para registrar un abono al capital
    async applyRepaymentToLoan(dto: RepaymentDto) {
        return this.loanRepaymentRepo.applyRepaymentToLoan(dto);
    }
}
