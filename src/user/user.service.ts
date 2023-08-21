import { ForbiddenException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/dao/user.entity';
import { UserDTO } from 'src/dto/user.dto';
import { IsNull, Not, Repository } from 'typeorm';

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

    async updateRtHash(userId: number, hash: string) {
        await this.userRepository.update(userId, {hashedRt: hash}).catch();
    }

    async removeRtHash(userId: number) {
        const userFromDb = await this.userRepository.findOne({
            where: {
                id: userId,
                hashedRt: Not(IsNull()),
            }
        }).catch();

        if (!userFromDb) {
            throw new ForbiddenException('Access denied');
        }

        userFromDb.hashedRt = null;

        await this.userRepository.save(userFromDb).catch();
    }
}
