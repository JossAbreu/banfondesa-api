import { applyDecorators } from '@nestjs/common';
import {
    ApiOperation,
    ApiResponse,
} from '@nestjs/swagger';
import { CreateUserDto } from '@/user/dto/v1.0/create-user.dto';
import { UserListResponseDto } from '@/user/dto/v1.0/users-list-response.dto'
import { UserResponseDto } from '@/user/dto/v1.0/user-response.dto'
import { UpdateUserDto } from '@/user/dto/v1.0/update-user.dto';

export function DocFindAllUsers() {
    return applyDecorators(
        ApiOperation({ summary: 'Listar todos los usuarios 👥' }),
        ApiResponse({ status: 200, description: 'Usuarios obtenidos exitosamente', type: UserListResponseDto }),
        ApiResponse({ status: 404, description: 'Usuarios no encontrados' }),
    );
}

export function DocCreateUser() {
    return applyDecorators(
        ApiOperation({ summary: 'Crear un nuevo usuario 🧑‍💻' }),
        ApiResponse({ status: 201, description: 'Usuario creado exitosamente', type: UserResponseDto }),
        ApiResponse({ status: 400, description: 'Datos inválidos o usuario ya existe' }),
    );
}

export function DocUpdateUser() {
    return applyDecorators(
        ApiOperation({ summary: 'Actualizar un usuario existente ✏️' }),
        ApiResponse({ status: 200, description: 'Usuario actualizado correctamente ', type: UserResponseDto }),
        ApiResponse({ status: 404, description: 'Usuario no encontrado' }),
        ApiResponse({ status: 401, description: 'No autorizado' }),
        ApiResponse({ status: 400, description: 'Datos inválidos para actualización' }),
    );
}
