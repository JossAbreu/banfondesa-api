import { Injectable, NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Client } from '@/clients/entities/clients.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateClientDto } from '@/clients/dto/v1.0/create-client.dto';
import { UpdateClientDto } from '@/clients/dto/v1.0/update-client.dto';
import { CreateClientService } from '@/clients/services/v1.0/create-client.service';
import { UpdateClientService } from '@/clients/services/v1.0/update-client.service';
import { ClientsBaseService } from '@/clients/services/clients.base.service';

@Injectable()
export class ClientsServiceV1 extends ClientsBaseService {
    constructor(
        @InjectRepository(Client)
        clientRepo: Repository<Client>,
        private readonly createClientService: CreateClientService,
        private readonly updateClientService: UpdateClientService,
    ) {
        super(clientRepo);
    }


    async create(dto: CreateClientDto): Promise<{ message: string; client: Client }> {
        return this.createClientService.create(dto);
    }

    async update(id: number, dto: UpdateClientDto): Promise<{ message: string; client: Client }> {
        return this.updateClientService.update(id, dto);
    }



}
