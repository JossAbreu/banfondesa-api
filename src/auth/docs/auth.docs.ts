
import { applyDecorators } from '@nestjs/common';
import {
    ApiOperation,
    ApiResponse,
} from '@nestjs/swagger';
import { LoginDto } from '../dto/login.dto';

export function DocLogin() {
    return applyDecorators(
        ApiOperation({ summary: 'Iniciar sesión 🔑' }),
        ApiResponse({ status: 200, description: 'Inicio de sesión exitoso', type: LoginDto }),
        ApiResponse({ status: 401, description: 'Credenciales inválidas' }),
    );
}

export function DocGetProfile() {
    return applyDecorators(
        ApiOperation({ summary: 'Obtener perfil de usuario autenticado 👀' }),
        ApiResponse({ status: 200, description: 'Perfil de usuario', type: LoginDto }),
        ApiResponse({ status: 401, description: 'No autorizado' }),
    );
}
