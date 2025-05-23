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
import { ApproveLoanDto } from './dto/approve-loan.dto';
import { AmortizationDto } from './dto/amortization.dto';
import { PaymentDto } from './dto/payment.dto';
import { AbonoDto } from '@loan/dto/abono.dto';
import { GetUser } from '@auth/decorators/get-user.decorator';
import { User } from '@user/entities/user.entity';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';


@ApiTags('Prestamos')
@Controller()
@UseGuards(JwtAuthGuard)
export class LoanController {
    constructor(private readonly loanService: LoanService) { }

    // 1. Crear préstamo
    @Post('v1.0/loan')
    @ApiOperation({ summary: 'Crear un nuevo préstamo' })
    @ApiResponse({ status: 200, description: 'El préstamo fue creado exitosamente.', type: CreateLoanDto })
    @ApiResponse({ status: 404, description: 'Cliente no encontrado' })
    @ApiResponse({ status: 400, description: 'El cliente ya tiene un préstamo pendiente' })
    createLoan(@Body() dto: CreateLoanDto) {
        return this.loanService.create(dto);
    }

    // 2. Listar préstamos
    @Get('v1.0/loan')
    @ApiOperation({ summary: 'Listar todos los préstamos' })
    getAllLoans() {
        return this.loanService.findAll();
    }

    // // 3. Obtener préstamo por ID (sin amortización)
    @Get('v1.0/loan/:id')
    getLoanById(@Param('id') id: string) {
        return this.loanService.findOneWithoutAmortization(+id);
    }

    // // 4. Obtener préstamo con amortización
    @Get('v2.0/loan/:id')
    getLoanWithAmortization(@Param('id') id: string) {
        return this.loanService.findOneWithAmortization(+id);
    }

    // 5. Aprobar / Rechazar préstamo
    @Post('v1.0/loan/approval')
    approveLoan(@Body() dto: ApproveLoanDto) {
        return this.loanService.approveOrReject(dto);
    }

    // 6. Obtener tabla de amortización
    @Post('v1.0/loan/amor')
    calculateAmortization(@Body() dto: AmortizationDto) {
        return this.loanService.calculateAmortization(dto);
    }

    // 7. Registrar pago de cuota
    @Post('v1.0/loan/payment')
    registerPayment(@Body() dto: PaymentDto) {
        return this.loanService.registerPayment(dto);
    }

    // 8. Realizar abono a capital
    @Post('v1.0/loan/abono')
    registerAbono(@Body() dto: AbonoDto) {
        return this.loanService.registerAbono(dto);
    }
}
