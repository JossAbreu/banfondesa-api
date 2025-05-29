import {
    Injectable,
    NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Loan } from '@loan/entities/loan.entity';
import { generateAmortization } from "@/loan/utils/generateAmortization.util"
import { LoanBaseService } from '@/loan/services/loan.base.service';



@Injectable()
export class LoanServiceV2 extends LoanBaseService {
    constructor(
        @InjectRepository(Loan)
        loanRepo: Repository<Loan>,

    ) {
        super(loanRepo);
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
            loan,
            amortization,
            interestAmount: totalInterest,
            monthlyPayment,
            totalAmount: totalToPay,
        };
    }

}



