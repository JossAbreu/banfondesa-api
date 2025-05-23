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
import { CapitalPayment } from './entities/capital-payment.entity'; // Asegúrate de importar esto correctamente
import { LoanApproval } from './entities/loan-approval.entity'; // Asegúrate de importar esto correctamente
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
        @InjectRepository(CapitalPayment)
        private readonly capitalPaymentRepo: Repository<CapitalPayment>,
        @InjectRepository(LoanApproval)
        private readonly loanApprovalRepo: Repository<LoanApproval>,
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

            const interest = dto.interestRate || loan.interestRate;
            loan.status = 'aprobado';
            loan.approvedAt = new Date();
            loan.interestRate = interest; // Asigna la tasa de interés si no está definida

            await this.loanRepo.save(loan);

            const amortization = this.generateAmortization(
                loan.amount,
                loan.termMonths,
                loan.interestRate,
                loan.amortizationType as 'fija' | 'variable',
            );

            const startDate = new Date();


            // Guardar la aprobación del préstamo
            const approval = this.loanApprovalRepo.create({
                loan,
                approved: true,
                decisionDate: new Date(),
                reviewerName: dto.reviewerName,
                comment: dto.comment,
            });

            await this.loanApprovalRepo.save(approval);

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
            dueDate: Date;
        };
        const amortization: AmortizationEntry[] = [];
        const startDate = new Date();
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
                    dueDate: this.calculateDueDate(startDate, i),
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
                    dueDate: this.calculateDueDate(startDate, i),
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
    async registerPayment(dto: PaymentDto) {
        const amortization = await this.loanAmortizationRepo.findOne({
            where: {
                loanId: dto.loanId,
                installmentNumber: dto.installmentNumber,
            },
        });

        if (!amortization) {
            throw new NotFoundException('Cuota no encontrada');
        }

        if (amortization.paid) {
            throw new BadRequestException('Esta cuota ya ha sido pagada');
        }

        // Validar que el monto sea suficiente
        if (dto.amountPaid < amortization.totalPayment) {
            throw new BadRequestException(
                `El monto pagado ($${dto.amountPaid}) es menor que el total requerido ($${amortization.totalPayment})`,
            );
        }

        const extra = dto.amountPaid - amortization.totalPayment;

        // Marcar la cuota como pagada
        amortization.paid = true;
        amortization.paymentDate = new Date();

        await this.loanAmortizationRepo.save(amortization);



        // ✅ Si hay monto extra, registrar abono al capital
        if (extra > 0) {
            const capitalPayment = this.capitalPaymentRepo.create({
                loan: { id: amortization.loanId },
                amount: extra,
                paymentDate: new Date(),
                description: `Abono extra del pago de la cuota #${dto.installmentNumber}`,
            });
            await this.capitalPaymentRepo.save(capitalPayment);

            // 🧠 Reducir el capital del préstamo y recalcular cuotas
            await this.recalculateAmortization(dto.loanId);
        }

        // Verificar si quedan cuotas pendientes
        const pendingPayments = await this.loanAmortizationRepo.count({
            where: {
                loanId: dto.loanId,
                paid: false,
            },
        });

        if (pendingPayments === 0) {
            const loan = await this.loanRepo.findOne({ where: { id: dto.loanId } });
            if (loan) {
                loan.status = 'pagado';
                await this.loanRepo.save(loan);
            }
        }

        return {
            message: 'Pago registrado correctamente',
            extraPayment: extra > 0 ? extra.toFixed(2) : 0,
        };
    }
    private async recalculateAmortization(loanId: number) {
        const loan = await this.loanRepo.findOne({ where: { id: loanId } });
        if (!loan) throw new NotFoundException('Préstamo no encontrado');

        // Obtener todas las cuotas ya pagadas
        const paidInstallments = await this.loanAmortizationRepo.find({
            where: { loanId, paid: true },
            order: { installmentNumber: 'ASC' }
        });

        const lastPaidInstallment = paidInstallments.length;

        // Calcular el nuevo capital pendiente
        console.log('loanId:', loanId);
        const remainingBalance = await this.calculateRemainingBalance(loanId);

        // Obtener número de cuotas restantes
        const remainingTerm = loan.termMonths - lastPaidInstallment;

        if (remainingTerm <= 0) {
            return; // Ya no hay cuotas por recalcular
        }

        // Generar nueva amortización para el capital restante
        console.log('Capital restante:', remainingBalance);
        console.log('Número de cuotas restantes:', remainingTerm);
        const newAmortization = this.generateAmortization(
            remainingBalance,
            remainingTerm,
            loan.interestRate,
            loan.amortizationType as 'fija' | 'variable',
        );
        console.log('Amortización recalculada:', newAmortization);
        // Eliminar solo las cuotas no pagadas
        await this.loanAmortizationRepo.delete({
            loanId,
            paid: false,
        });





        // Insertar las nuevas cuotas recalculadas, ajustando el número de cuota
        const startDate = new Date();
        for (let i = 0; i < newAmortization.length; i++) {
            const item = newAmortization[i];
            await this.loanAmortizationRepo.save({
                loanId,
                installmentNumber: lastPaidInstallment + 1 + i,
                dueDate: this.calculateDueDate(startDate, lastPaidInstallment + 1 + i),
                principal: item.principal,
                interest: item.interest,
                totalPayment: item.total,
                paid: false,
                paymentDate: null
            });
        }
    }
    private async calculateRemainingBalance(loanId: number): Promise<number> {
        const loan = await this.loanRepo.findOne({ where: { id: loanId } });
        if (!loan) throw new NotFoundException('Préstamo no encontrado');

        const amortizations = await this.loanAmortizationRepo.find({
            where: { loanId, paid: false },
        });
        if (!amortizations || amortizations.length === 0) {
            throw new NotFoundException('No hay cuotas pendientes');
        }

        // También considera los abonos extras al capital
        const capitalPayments = await this.capitalPaymentRepo.find({
            where: { loanId },
            relations: ['loan'],
        });

        // console.log('Amortizaciones pendientes:', amortizations);
        // console.log('Abonos al capital:', capitalPayments);

        const totalRemaining = amortizations.reduce((sum, a) => sum + Number(a.principal), 0);
        const totalCapitalPaid = capitalPayments.reduce((sum, p) => sum + Number(p.amount), 0);

        // console.log('Total capital restante:', totalRemaining);
        // console.log('Total capital pagado:', totalCapitalPaid);

        // console.log('Capital restante después de abonos:', totalRemaining - totalCapitalPaid);
        return Math.max(totalRemaining - totalCapitalPaid, 0);
    }



    // async registerAbono(dto: AbonoDto) { ... }
}
