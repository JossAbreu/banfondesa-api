import { Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { Client } from "@client/entities/clients.entity";
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreateClientService } from '@client/services/create-client.service';
import { UpdateClientService } from '@client/services/update-client.service';

@Module({
    providers: [ClientsService, CreateClientService, UpdateClientService],
    controllers: [ClientsController],
    exports: [ClientsService, TypeOrmModule],
    imports: [
        TypeOrmModule.forFeature([Client]),
    ],

})
export class ClientsModule { }
