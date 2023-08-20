import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/dao/user.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) 
        private readonly userRepository: Repository<User>
    ) {}

    async findByUsername(username: string): Promise<User> {
        try {
            const userFromDb = await this.userRepository.findOne({
                where: {username: username}
            }).catch();

            return userFromDb;

        } catch (err) {
            console.log(err);
            throw new InternalServerErrorException;
        }
    }
}
