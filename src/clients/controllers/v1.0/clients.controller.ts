import { Body, Controller, Get, Post, Put, UseGuards, Param } from '@nestjs/common';
import { ClientsServiceV1 } from '@/clients/services/v1.0/clients.service';
import { JwtAuthGuard } from '@auth/guards/jwt.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateClientDto } from '@/clients/dto/v1.0/create-client.dto';
import { UpdateClientDto } from '@/clients/dto/v1.0/update-client.dto';
import { DocCreateClient, DocUpdateClient, DocFindAllClients } from '@/clients/docs/v1.0/clients.docs';


@ApiTags('Clientes 👤')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
@Controller({ path: 'client', version: '1.0' })
export class ClientsControllerV1 {

    constructor(private readonly clientsServicev1: ClientsServiceV1) { }

    @DocCreateClient()
    @Post()
    create(@Body() dto: CreateClientDto) {
        return this.clientsServicev1.create(dto);
    }

    @DocUpdateClient()
    @Put(':id')
    update(@Param('id') id: number, @Body() dto: UpdateClientDto) {
        return this.clientsServicev1.update(id, dto);
    }

    @DocFindAllClients()
    @Get()
    findAll() {
        return this.clientsServicev1.findAll();
    }
}
