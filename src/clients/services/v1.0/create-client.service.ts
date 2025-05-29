import { Injectable, NotFoundException } from "@nestjs/common";

import { CreateClientDto } from "@/clients/dto/v1.0/create-client.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Client } from "@client/entities/clients.entity";


@Injectable()
export class CreateClientService {
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
}