import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Client } from '@/clients/entities/clients.entity';

import { InjectRepository } from '@nestjs/typeorm';
import { CreateClientDto } from '@client/dto/create-client.dto';
import { UpdateClientDto } from '@client/dto/update-client.dto';

@Injectable()
export class ClientsService {
    constructor(
        @InjectRepository(Client)
        private readonly clientRepo: Repository<Client>,
    ) { }



    async create(dto: CreateClientDto): Promise<{ message: string; client: Client }> {
        const existingClient = await this.clientRepo.findOne({ where: { email: dto.email } });
        if (existingClient) {
            throw new NotFoundException('El cliente ya existe');
        }
        const newClient = this.clientRepo.create(dto);
        await this.clientRepo.save(newClient);
        return { message: 'Cliente creado', client: newClient };
    }

    async update(id: number, dto: UpdateClientDto): Promise<{ message: string; client: Client }> {
        const client = await this.clientRepo.findOne({ where: { id } });
        if (!client) {
            throw new NotFoundException('Cliente no encontrado');
        }
        const updatedClient = this.clientRepo.create({ ...client, ...dto });
        await this.clientRepo.save(updatedClient);
        return { message: 'Cliente actualizado', client: updatedClient };
    }

    async findAll(): Promise<{ message: string; clients: Client[] }> {
        return { message: 'Lista de clientes', clients: await this.clientRepo.find() };
    }

    async findOne(id: number): Promise<{ message: string; client: Client }> {
        const client = await this.clientRepo.findOne({ where: { id } });
        if (!client) {
            throw new NotFoundException('Cliente no encontrado');
        }
        return { message: 'Cliente encontrado', client };
    }
}
