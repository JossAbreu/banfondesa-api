import {
    Controller,
    Post,
    Get,
    Param,
    Body,
    UseGuards,
} from '@nestjs/common';
import { LoanService } from './loan.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';
import { CreateLoanDto } from './dto/create-loan.dto';
import { ApproveOrRejectLoanDto } from './dto/approve-or-reject-loan.dto';
import { AmortizationDto } from './dto/amortization.dto';
import { PaymentDto } from './dto/payment.dto';
import { RepaymentDto } from '@/loan/dto/repayment.dto';

import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { DocCreateLoan, DocGetAllLoans, DocGetLoanById, DocGetLoanWithAmortization, DocApproveOrRejectLoan, DocCalculateAmortization, DocRegisterPayment, DocRegisterAbono } from '@loan/docs/loan.docs';

@ApiTags('Prestamos 📑')
@ApiBearerAuth('access-token')
@Controller()
@UseGuards(JwtAuthGuard)
export class LoanController {
    constructor(private readonly loanService: LoanService) { }

    // 1. Crear préstamo
    @Post('v1.0/loan')
    @DocCreateLoan()
    createLoan(@Body() dto: CreateLoanDto) {
        return this.loanService.create(dto);
    }

    // 2. Listar préstamos
    @Get('v1.0/loan')
    @DocGetAllLoans()
    getAllLoans() {
        return this.loanService.findAll();
    }

    // 3. Obtener préstamo por ID (sin amortización)
    @Get('v1.0/loan/:id')
    @DocGetLoanById()
    getLoanById(@Param('id') id: string) {
        return this.loanService.findOneWithoutAmortization(+id);
    }

    //  4. Obtener préstamo con amortización
    @Get('v2.0/loan/:id')
    @DocGetLoanWithAmortization()
    getLoanWithAmortization(@Param('id') id: string) {
        return this.loanService.findOneWithAmortization(+id);
    }

    // 5. Aprobar / Rechazar préstamo
    @Post('v1.0/loan/approval')
    @DocApproveOrRejectLoan()
    approveLoan(@Body() dto: ApproveOrRejectLoanDto) {
        return this.loanService.approveOrReject(dto);
    }

    // 6. Obtener tabla de amortización
    @Post('v1.0/loan/amor')
    @DocCalculateAmortization()
    calculateAmortization(@Body() dto: AmortizationDto) {
        return this.loanService.calculateAmortization(dto);
    }

    // 7. Registrar pago de cuota
    @Post('v1.0/loan/payment')
    @DocRegisterPayment()
    registerPayment(@Body() dto: PaymentDto) {
        return this.loanService.registerPayment(dto);
    }

    // 8. Realizar abono a capital
    @Post('v1.0/loan/abono')
    @DocRegisterAbono()
    registerAbono(@Body() dto: RepaymentDto) {
        return this.loanService.applyRepaymentToLoan(dto);
    }
}
