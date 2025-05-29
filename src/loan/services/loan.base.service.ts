import {
    Injectable,

} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Loan } from '@loan/entities/loan.entity';


@Injectable()
export class LoanBaseService {
    constructor(
        @InjectRepository(Loan)
        protected readonly loanRepo: Repository<Loan>,

    ) { }

    //metodo para listar todos los préstamos
    async findAll() {
        return {
            message: 'Lista de préstamos',
            loans: await this.loanRepo.find(),
        };
    }

}
