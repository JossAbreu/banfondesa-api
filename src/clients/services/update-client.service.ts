import { Injectable, NotFoundException } from "@nestjs/common";


import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Client } from "@client/entities/clients.entity";
import { UpdateClientDto } from '@client/dto/update-client.dto';


@Injectable()
export class UpdateClientService {
    constructor(
        @InjectRepository(Client)
        private readonly clientRepo: Repository<Client>,
    ) { }

    async update(id: number, dto: UpdateClientDto): Promise<{ message: string; client: Client }> {
        const client = await this.clientRepo.findOne({ where: { id } });
        if (!client) {
            throw new NotFoundException('Cliente no encontrado');
        }
        const updatedClient = this.clientRepo.create({ ...client, ...dto });
        await this.clientRepo.save(updatedClient);
        return { message: 'Cliente actualizado', client: updatedClient };
    }
}