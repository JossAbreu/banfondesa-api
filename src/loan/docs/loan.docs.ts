import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

export function DocCreateLoan() {
    return applyDecorators(
        ApiOperation({ summary: 'Crear un nuevo préstamo 💳' }),
        ApiResponse({ status: 200, description: 'Préstamo creado exitosamente' }),
        ApiResponse({ status: 404, description: 'Cliente no encontrado' }),
        ApiResponse({ status: 400, description: 'Cliente ya tiene un préstamo pendiente' })
    );
}

export function DocGetAllLoans() {
    return applyDecorators(
        ApiOperation({ summary: 'Listar todos los préstamos 📄' }),
        ApiResponse({ status: 200, description: 'Lista de préstamos obtenida exitosamente' })
    );
}

export function DocGetLoanById() {
    return applyDecorators(
        ApiOperation({ summary: 'Obtener préstamo sin amortización 🔍' }),
        ApiParam({ name: 'id', description: 'ID del préstamo' }),
        ApiResponse({ status: 200, description: 'Préstamo encontrado exitosamente' }),
        ApiResponse({ status: 404, description: 'Préstamo no encontrado' })
    );
}

export function DocGetLoanWithAmortization() {
    return applyDecorators(
        ApiOperation({ summary: 'Obtener préstamo con amortización 📈' }),
        ApiParam({ name: 'id', description: 'ID del préstamo' }),
        ApiResponse({ status: 200, description: 'Préstamo con amortización generado correctamente' })
    );
}

export function DocApproveOrRejectLoan() {
    return applyDecorators(
        ApiOperation({ summary: 'Aprobar o rechazar préstamo ✅❌' }),
        ApiResponse({ status: 200, description: 'Préstamo aprobado o rechazado exitosamente' })
    );
}

export function DocCalculateAmortization() {
    return applyDecorators(
        ApiOperation({ summary: 'Calcular tabla de amortización 📊' }),
        ApiResponse({ status: 200, description: 'Tabla de amortización generada correctamente' })
    );
}

export function DocRegisterPayment() {
    return applyDecorators(
        ApiOperation({ summary: 'Registrar pago de cuota 💵' }),
        ApiResponse({ status: 200, description: 'Pago registrado correctamente' })
    );
}

export function DocRegisterAbono() {
    return applyDecorators(
        ApiOperation({ summary: 'Realizar abono a capital 🧾' }),
        ApiResponse({ status: 200, description: 'Abono aplicado exitosamente' })
    );
}
