import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Client } from '@/clients/entities/clients.entity';
import { InjectRepository } from '@nestjs/typeorm';


@Injectable()
export class ClientsBaseService {
    constructor(
        @InjectRepository(Client)
        protected readonly clientRepo: Repository<Client>,

    ) { }


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
