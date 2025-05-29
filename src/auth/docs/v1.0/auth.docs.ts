
import { applyDecorators } from '@nestjs/common';
import {
    ApiOperation,
    ApiResponse,
} from '@nestjs/swagger';
import { LoginResponseDto } from '@/auth/dto/v1.0/login.response.dto';


export function DocLogin() {
    return applyDecorators(
        ApiOperation({ summary: 'Iniciar sesión 🔑' }),
        ApiResponse({ status: 200, description: 'Inicio de sesión exitoso', type: LoginResponseDto }),
        ApiResponse({ status: 401, description: 'Credenciales inválidas' }),
    );
}

export function DocGetProfile() {
    return applyDecorators(
        ApiOperation({ summary: 'Obtener perfil de usuario autenticado 👀' }),
        ApiResponse({ status: 200, description: 'Perfil de usuario', }),
        ApiResponse({ status: 401, description: 'No autorizado' }),
    );
}
