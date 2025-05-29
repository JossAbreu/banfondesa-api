import {
    Controller,
    Post,
    Get,
    Param,
    Body,
    UseGuards,
} from '@nestjs/common';
import { LoanService } from '@loan/loan.service';
import { JwtAuthGuard } from '@auth/guards/jwt.guard';
import { CreateLoanDto } from '@loan/dto/create-loan.dto';
import { ApproveOrRejectLoanDto } from '@loan/dto/approve-or-reject-loan.dto';
import { AmortizationDto } from '@loan/dto/amortization.dto';
import { PaymentDto } from '@loan/dto/payment.dto';
import { RepaymentDto } from '@/loan/dto/repayment.dto';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { DocCreateLoan, DocGetAllLoans, DocGetLoanById, DocApproveOrRejectLoan, DocCalculateAmortization, DocRegisterPayment, DocRegisterAbono } from '@loan/docs/loan.docs';

@ApiTags('Prestamos 📑')
@ApiBearerAuth('access-token')
@Controller({ path: 'loan', version: '1.0' })
@UseGuards(JwtAuthGuard)
export class V1LoanController {
    constructor(private readonly loanService: LoanService) { }

    // 1. Crear préstamo
    @Post('')
    @DocCreateLoan()
    createLoan(@Body() dto: CreateLoanDto) {
        return this.loanService.create(dto);
    }

    // 2. Listar préstamos
    @Get('')
    @DocGetAllLoans()
    getAllLoans() {
        return this.loanService.findAll();
    }

    // 3. Obtener préstamo por ID (sin amortización)
    @Get(':id')
    @DocGetLoanById()
    getLoanById(@Param('id') id: string) {
        return this.loanService.findOneWithoutAmortization(+id);
    }

    // 5. Aprobar / Rechazar préstamo
    @Post('approval')
    @DocApproveOrRejectLoan()
    approveLoan(@Body() dto: ApproveOrRejectLoanDto) {
        return this.loanService.approveOrReject(dto);
    }

    // 6. Obtener tabla de amortización
    @Post('amor')
    @DocCalculateAmortization()
    calculateAmortization(@Body() dto: AmortizationDto) {
        return this.loanService.calculateAmortization(dto);
    }

    // 7. Registrar pago de cuota
    @Post('payment')
    @DocRegisterPayment()
    registerPayment(@Body() dto: PaymentDto) {
        return this.loanService.registerPayment(dto);
    }

    // 8. Realizar abono a capital
    @Post('abono')
    @DocRegisterAbono()
    registerAbono(@Body() dto: RepaymentDto) {
        return this.loanService.applyRepaymentToLoan(dto);
    }
}
