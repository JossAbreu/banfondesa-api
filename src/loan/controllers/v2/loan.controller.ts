import {
    Controller,
    Get,
    Param,
    UseGuards,
} from '@nestjs/common';
import { LoanService } from '@loan/loan.service';
import { JwtAuthGuard } from '@auth/guards/jwt.guard';


import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { DocGetLoanWithAmortization } from '@loan/docs/loan.docs';

@ApiTags('Prestamos 📑')
@ApiBearerAuth('access-token')
@Controller('v2.0/loan')
@UseGuards(JwtAuthGuard)
export class V2LoanController {
    constructor(private readonly loanService: LoanService) { }

    //  4. Obtener préstamo con amortización
    @Get(':id')
    @DocGetLoanWithAmortization()
    getLoanWithAmortization(@Param('id') id: string) {
        return this.loanService.findOneWithAmortization(+id);
    }


}
