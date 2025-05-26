import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Client } from '@/clients/entities/clients.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateClientDto } from '@client/dto/create-client.dto';
import { UpdateClientDto } from '@client/dto/update-client.dto';
import { CreateClientService } from '@client/services/create-client.service';
import { UpdateClientService } from '@client/services/update-client.service';

@Injectable()
export class ClientsService {
    constructor(
        @InjectRepository(Client)
        private readonly clientRepo: Repository<Client>,
        private readonly createClientService: CreateClientService,
        private readonly updateClientService: UpdateClientService,
    ) { }


    async create(dto: CreateClientDto): Promise<{ message: string; client: Client }> {
        return this.createClientService.create(dto);
    }

    async update(id: number, dto: UpdateClientDto): Promise<{ message: string; client: Client }> {
        return this.updateClientService.update(id, dto);
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
