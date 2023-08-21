import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/dao/user.entity';
import { AuthDTO } from 'src/dto/auth.dto';
import { UserDTO } from 'src/dto/user.dto';
import { Repository } from 'typeorm';

import { UserMapper } from 'src/mapper/user.mapper';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) 
        private readonly userRepository: Repository<User>,
        private readonly userMapper: UserMapper
    ) {}

    async findByUsername(username: string): Promise<User> {
        const userFromDb = await this.userRepository.findOne({
            where: {username: username}
        }).catch(() => {throw new InternalServerErrorException('Error while signing in')});
        
        return userFromDb;
    }

    async createUser(username: string, hash: string): Promise<UserDTO> {
        const userToSave: User = new User(username, hash);
        
        return this.userMapper.entityToDto(
            await this.userRepository.save(userToSave)
                .catch(() => {throw new InternalServerErrorException('Error while creating user')})
        );
    }

    async existsByUsername(username: string): Promise<boolean> {
        let doesExist: boolean = false;
        if (
            await this.userRepository.findOne({where: {username: username}})
                .catch(() => {throw new InternalServerErrorException('Error while creating user')})
        ) {
            doesExist = true
        }

        return doesExist;
    }
}
