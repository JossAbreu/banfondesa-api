import { Module } from '@nestjs/common';
import { ClientsServiceV1 } from '@client/services/v1.0/clients.service';
import { ClientsControllerV1 } from '@client/controllers/v1.0/clients.controller';
import { Client } from "@client/entities/clients.entity";
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateClientService } from '@/clients/services/v1.0/create-client.service';
import { UpdateClientService } from '@/clients/services/v1.0/update-client.service';

@Module({
    providers: [ClientsServiceV1, CreateClientService, UpdateClientService],
    controllers: [ClientsControllerV1],
    exports: [ClientsServiceV1, TypeOrmModule],
    imports: [
        TypeOrmModule.forFeature([Client]),
    ],

})
export class ClientsModule { }
