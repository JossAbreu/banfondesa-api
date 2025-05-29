
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from '@/user/dto/v1.0/create-user.dto';
import { UpdateUserDto } from '@/user/dto/v1.0/update-user.dto';
import { User } from '@user/entities/user.entity';
import { CrearUserService } from '@/user/services/v1.0/crear-user.service';
import { UpdateUserService } from '@/user/services/v1.0/update-user.service';
import { UserResponseDto } from '@/user/dto/v1.0/user-response.dto';
import { UserBaseService } from '@/user/services/user.base.service';



@Injectable()
export class UserServiceV1 extends UserBaseService {
    constructor(
        @InjectRepository(User)
        userRepo: Repository<User>,
        private crearUserRepo: CrearUserService,
        private updateUserRepo: UpdateUserService,
    ) {
        super(userRepo);
    }

    async create(createUserDto: CreateUserDto): Promise<UserResponseDto> {
        return this.crearUserRepo.create(createUserDto);
    }

    async update(id: number, updateUserDto: UpdateUserDto): Promise<UserResponseDto> {
        return this.updateUserRepo.updateUser(id, updateUserDto);

    }


}
