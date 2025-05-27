import { Body, Controller, Get, Post, Put, UseGuards, Param } from '@nestjs/common';
import { ClientsService } from '@client/clients.service';
import { JwtAuthGuard } from '@auth/guards/jwt.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateClientDto } from '@client/dto/create-client.dto';
import { UpdateClientDto } from '@client/dto/update-client.dto';
import { DocCreateClient, DocUpdateClient, DocFindAllClients } from '@client/docs/clients.docs';


@ApiTags('Clientes 👤')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('access-token')
@Controller('v1.0/client')
export class ClientsController {

    constructor(private readonly clientsService: ClientsService) { }

    @DocCreateClient()
    @Post()
    create(@Body() dto: CreateClientDto) {
        return this.clientsService.create(dto);
    }

    @DocUpdateClient()
    @Put(':id')
    update(@Param('id') id: number, @Body() dto: UpdateClientDto) {
        return this.clientsService.update(id, dto);
    }

    @DocFindAllClients()
    @Get()
    findAll() {
        return this.clientsService.findAll();
    }
}
