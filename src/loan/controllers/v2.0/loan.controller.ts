import {
    Controller,
    Get,
    Param,
    UseGuards,
} from '@nestjs/common';
import { LoanServiceV2 } from '@/loan/services/v2.0/loan.service';
import { JwtAuthGuard } from '@auth/guards/jwt.guard';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { DocGetLoanWithAmortization } from '@/loan/docs/v2.0/loan.docs';



@ApiTags('Prestamos 📑')
@ApiBearerAuth('access-token')
@Controller({ path: 'loan', version: '2.0' })
@UseGuards(JwtAuthGuard)
export class V2LoanController {
    constructor(private readonly loanServiceV2: LoanServiceV2) { }

    //  4. Obtener préstamo con amortización
    @Get(':id')
    @DocGetLoanWithAmortization()
    getLoanWithAmortization(@Param('id') id: string) {
        return this.loanServiceV2.findOneWithAmortization(+id);
    }


}