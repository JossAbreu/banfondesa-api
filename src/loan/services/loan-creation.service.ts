import {
    Injectable,
    NotFoundException,
    BadRequestException,

} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Loan } from '@loan/entities/loan.entity';
import { Client } from '@client/entities/clients.entity';
import { CreateLoanDto } from '@loan/dto/create-loan.dto';


@Injectable()
export class LoanCreationService {
    constructor(
        @InjectRepository(Loan)
        private readonly loanRepo: Repository<Loan>,
        @InjectRepository(Client)
        private readonly clientRepo: Repository<Client>,

    ) { }

    async create(dto: CreateLoanDto): Promise<{ message: string, loan: Loan }> {
        const client = await this.clientRepo.findOne({ where: { id: dto.clientId } });
        if (!client) {
            throw new NotFoundException('Cliente no encontrado');
        }

        if (dto.amount <= 0) {
            throw new BadRequestException('El monto del préstamo debe ser mayor a cero');
        }


        const loan = this.loanRepo.create({
            amount: dto.amount,
            termMonths: dto.termMonths,
            interestRate: dto.interestRate,
            amortizationType: dto.amortizationType,
            clientId: dto.clientId,
        });

        return { message: 'Préstamo creado correctamente', loan: await this.loanRepo.save(loan) };
    }


}
