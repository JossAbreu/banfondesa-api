
import { applyDecorators } from '@nestjs/common';
import {
    ApiOperation,
    ApiResponse,
    ApiBadRequestResponse,
    ApiParam,
} from '@nestjs/swagger';
import { CreateClientDto } from '@client/dto/create-client.dto';
import { UpdateClientDto } from '@client/dto/update-client.dto';

export function DocCreateClient() {
    return applyDecorators(
        ApiOperation({ summary: 'Crear un nuevo cliente 👤' }),
        ApiResponse({ status: 201, description: 'Cliente creado exitosamente', type: CreateClientDto }),
        ApiResponse({ status: 404, description: 'Cliente no encontrado' }),
        ApiBadRequestResponse({ description: 'El cliente ya existe' }),
    );
}

export function DocUpdateClient() {
    return applyDecorators(
        ApiOperation({ summary: 'Actualizar un cliente 📋' }),
        ApiResponse({ status: 200, description: 'Cliente actualizado exitosamente', type: UpdateClientDto }),
        ApiResponse({ status: 404, description: 'Cliente no encontrado' }),
        ApiBadRequestResponse({ description: 'El cliente ya existe' }),
        ApiParam({ name: 'id', description: 'ID del cliente a actualizar' }),
    );
}

export function DocFindAllClients() {
    return applyDecorators(
        ApiOperation({ summary: 'Obtener lista de clientes 👀' }),
        ApiResponse({ status: 200, description: 'Clientes Registrados', type: [CreateClientDto] }),
        ApiResponse({ status: 404, description: 'Clientes no encontrados' }),
    );
}
