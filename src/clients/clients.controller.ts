import { Body, Controller, Get, Post, Put, UseGuards, Param } from '@nestjs/common';
import { ClientsService } from './clients.service';
import { JwtAuthGuard } from '@auth/guards/jwt.guard';
import { ApiTags } from '@nestjs/swagger';
import { CreateClientDto } from '@client/dto/create-client.dto';
import { UpdateClientDto } from '@client/dto/update-client.dto';


@ApiTags('client')
@UseGuards(JwtAuthGuard)
@Controller('v1.0/client')
export class ClientsController {

    constructor(private readonly clientsService: ClientsService) { }

    @Post()
    create(@Body() dto: CreateClientDto) {
        return this.clientsService.create(dto);
    }

    @Put(':id')
    update(@Param('id') id: number, @Body() dto: UpdateClientDto) {
        return this.clientsService.update(id, dto);
    }

    @Get()
    findAll() {
        return this.clientsService.findAll();
    }
}
