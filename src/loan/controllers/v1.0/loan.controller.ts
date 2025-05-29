import {
    Controller,
    Post,
    Get,
    Param,
    Body,
    UseGuards,
} from '@nestjs/common';
import { LoanServiceV1 } from '@/loan/services/v1.0/loan.service';
import { JwtAuthGuard } from '@auth/guards/jwt.guard';
import { CreateLoanDto } from '@/loan/dto/v1.0/create-loan.dto';
import { ApproveOrRejectLoanDto } from '@/loan/dto/v1.0/approve-or-reject-loan.dto';
import { AmortizationDto } from '@/loan/dto/v1.0/amortization.dto';
import { PaymentDto } from '@/loan/dto/v1.0/payment.dto';
import { RepaymentDto } from '@/loan/dto/v1.0/repayment.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { DocCreateLoan, DocGetAllLoans, DocGetLoanById, DocApproveOrRejectLoan, DocCalculateAmortization, DocRegisterPayment, DocRegisterAbono } from '@/loan/docs/v1.0/loan.docs';

@ApiTags('Prestamos 📑')
@ApiBearerAuth('access-token')
@Controller({ path: 'loan', version: '1.0' })
@UseGuards(JwtAuthGuard)
export class V1LoanController {
    constructor(private readonly loanServiceV1: LoanServiceV1) { }

    // 1. Crear préstamo
    @Post('')
    @DocCreateLoan()
    createLoan(@Body() dto: CreateLoanDto) {
        return this.loanServiceV1.create(dto);
    }

    // 2. Listar préstamos
    @Get('')
    @DocGetAllLoans()
    getAllLoans() {
        return this.loanServiceV1.findAll();
    }

    // 3. Obtener préstamo por ID (sin amortización)
    @Get(':id')
    @DocGetLoanById()
    getLoanById(@Param('id') id: string) {
        return this.loanServiceV1.findOneWithoutAmortization(+id);
    }

    // 5. Aprobar / Rechazar préstamo
    @Post('approval')
    @DocApproveOrRejectLoan()
    approveLoan(@Body() dto: ApproveOrRejectLoanDto) {
        return this.loanServiceV1.approveOrReject(dto);
    }

    // 6. Obtener tabla de amortización
    @Post('amor')
    @DocCalculateAmortization()
    calculateAmortization(@Body() dto: AmortizationDto) {
        return this.loanServiceV1.calculateAmortization(dto);
    }

    // 7. Registrar pago de cuota
    @Post('payment')
    @DocRegisterPayment()
    registerPayment(@Body() dto: PaymentDto) {
        return this.loanServiceV1.registerPayment(dto);
    }

    // 8. Realizar abono a capital
    @Post('abono')
    @DocRegisterAbono()
    registerAbono(@Body() dto: RepaymentDto) {
        return this.loanServiceV1.applyRepaymentToLoan(dto);
    }
}
