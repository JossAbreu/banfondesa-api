import {
    Injectable,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Loan } from '@loan/entities/loan.entity';
import { CreateLoanDto } from '@/loan/dto/v1.0/create-loan.dto';
import { ApproveOrRejectLoanDto } from '@/loan/dto/v1.0/approve-or-reject-loan.dto';
import { AmortizationDto } from '@/loan/dto/v1.0/amortization.dto';
import { PaymentDto } from '@/loan/dto/v1.0/payment.dto';
import { RepaymentDto } from '@/loan/dto/v1.0/repayment.dto';

import { LoanCreationService } from '@/loan/services/v1.0/loan-creation.service';
import { LoanAprovalOrRejectService } from '@/loan/services/v1.0/loan-aproval-or-reject.service';
import { generateAmortization } from "@/loan/utils/generateAmortization.util"
import { LoanPaymentService } from '@/loan/services/v1.0/loan-payment.service';
import { LoanRepaymentService } from '@/loan/services/v1.0/loan-repayment.service';
import { LoanBaseService } from '@/loan/services/loan.base.service';


@Injectable()
export class LoanServiceV1 extends LoanBaseService {
    constructor(
        @InjectRepository(Loan)
        loanRepo: Repository<Loan>,
        private readonly loanCreation: LoanCreationService,
        private readonly loanApprovalOrRejectRepo: LoanAprovalOrRejectService,
        private readonly loanPaymentRepo: LoanPaymentService,
        private readonly loanRepaymentRepo: LoanRepaymentService,
    ) {
        super(loanRepo);
    }
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
