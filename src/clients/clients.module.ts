import { Module } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { ClientsController } from './clients.controller';
import { Client } from "@client/entities/clients.entity";
import { TypeOrmModule } from '@nestjs/typeorm';


@Module({
    providers: [ClientsService],
    controllers: [ClientsController],
    exports: [ClientsService, TypeOrmModule],
    imports: [
        TypeOrmModule.forFeature([Client]),
    ],

})
export class ClientsModule { }
