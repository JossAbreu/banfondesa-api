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

import { LoanAmortization } from './entities/loan-amortization.entity'; // 
import { CapitalPayment } from './entities/capital-payment.entity';
import { LoanApproval } from './entities/loan-approval.entity';
import { Client } from '@/clients/entities/clients.entity';

import { LoanCreationService } from '@loan/services/loan-creation.service';
import { LoanAprovalOrRejectService } from '@loan/services/loan-aproval.service';
import { generateAmortization } from "@/loan/utils/generateAmortization.util"
import { recalculateAmortization, calculateRemainingBalance } from "@/loan/utils/recalculateAmortization.util"
import { LoanPaymentService } from '@loan/services/loan-payment.service';

@Injectable()
export class LoanService {
    constructor(
        @InjectRepository(Loan)
        private readonly loanRepo: Repository<Loan>,

        @InjectRepository(LoanAmortization)
        private readonly loanAmortizationRepo: Repository<LoanAmortization>,
        @InjectRepository(CapitalPayment)
        private readonly capitalPaymentRepo: Repository<CapitalPayment>,

        private readonly loanCreation: LoanCreationService,
        private readonly loanApprovalOrRejectRepo: LoanAprovalOrRejectService,
        private readonly loanPaymentRepo: LoanPaymentService,
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
    async approveOrReject(dto: ApproveLoanDto) {
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
    async registerAbono(dto: AbonoDto) {
        //verificop si el monto es mayor a 0
        if (dto.amount <= 0) {
            throw new BadRequestException('El monto debe ser mayor a 0');
        }
        //verifico si el préstamo existe
        const loan = await this.loanRepo.findOne({ where: { id: dto.loanId } });
        if (!loan) throw new NotFoundException('Préstamo no encontrado');

        const capitalPayment = this.capitalPaymentRepo.create({
            loan,
            amount: dto.amount,
        });
        await this.capitalPaymentRepo.save(capitalPayment);

        // Recalcular la amortización del préstamo
        await recalculateAmortization(loan.id, this.loanRepo, this.loanAmortizationRepo, this.capitalPaymentRepo);

        return {
            message: 'Abono registrado correctamente',
            remaining: await calculateRemainingBalance(loan.id, this.loanRepo, this.loanAmortizationRepo, this.capitalPaymentRepo),
            capitalPayment: capitalPayment.amount,
        };
    }
}
