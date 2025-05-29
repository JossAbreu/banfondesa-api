import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';


export function DocGetLoanWithAmortization() {
    return applyDecorators(
        ApiOperation({ summary: 'Obtener préstamo con amortización 📈' }),
        ApiParam({ name: 'id', description: 'ID del préstamo' }),
        ApiResponse({ status: 200, description: 'Préstamo con amortización generado correctamente' }),
        ApiResponse({ status: 401, description: 'No autorizado' }),
        ApiResponse({ status: 404, description: 'Préstamo no encontrado' })
    );
}
