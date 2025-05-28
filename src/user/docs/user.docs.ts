import { applyDecorators } from '@nestjs/common';
import {
    ApiOperation,
    ApiResponse,
} from '@nestjs/swagger';
import { CreateUserDto } from '@user/dto/create-user.dto';
import { UpdateUserDto } from '@user/dto/update-user.dto';

export function DocFindAllUsers() {
    return applyDecorators(
        ApiOperation({ summary: 'Listar todos los usuarios 👥' }),
        ApiResponse({ status: 200, description: 'Usuarios obtenidos exitosamente', type: [CreateUserDto] }),
        ApiResponse({ status: 404, description: 'Usuarios no encontrados' }),
    );
}

export function DocCreateUser() {
    return applyDecorators(
        ApiOperation({ summary: 'Crear un nuevo usuario 🧑‍💻' }),
        ApiResponse({ status: 201, description: 'Usuario creado exitosamente', type: CreateUserDto }),
        ApiResponse({ status: 400, description: 'Datos inválidos o usuario ya existe' }),
    );
}

export function DocUpdateUser() {
    return applyDecorators(
        ApiOperation({ summary: 'Actualizar un usuario existente ✏️' }),
        ApiResponse({ status: 200, description: 'Usuario actualizado correctamente', type: UpdateUserDto }),
        ApiResponse({ status: 404, description: 'Usuario no encontrado' }),
        ApiResponse({ status: 401, description: 'No autorizado' }),
        ApiResponse({ status: 400, description: 'Datos inválidos para actualización' }),
    );
}
