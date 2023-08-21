import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { Pet } from '../dao/pet.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PetMapper } from '../mapper/pet.mapper';
import { PetDTO } from 'src/dto/pet.dto';
import { PetType } from 'src/dao/type.entity';
import { PetUpdateDTO } from 'src/dto/pet-update.dto';
import { Color } from 'src/dao/color.entity';
import { Country } from 'src/dao/country.entity';
import { User } from 'src/dao/user.entity';

@Injectable()
export class PetService {

    constructor(
        @InjectRepository(Pet) 
        private readonly petRepository: Repository<Pet>,
        @InjectRepository(PetType)
        private readonly typeRepository: Repository<PetType>,
        @InjectRepository(Color)
        private readonly colorRepository: Repository<Color>,
        @InjectRepository(Country)
        private readonly countryRepository: Repository<Country>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        private readonly petMapper: PetMapper
    ) {}

    async findAllByUser(userId: number): Promise<PetDTO[]> {
        const petsFromDb = await this.petRepository.find({
            where: {user: {id: userId}},
            relations: {
                type: true,
                color: true,
                country: true,
            }
        }).catch(() => {throw new InternalServerErrorException});

        const petDTOs = this.petMapper.entitiesToDtos(petsFromDb);

        return petDTOs;
    }

    async findById(id: number, userId: number): Promise<PetDTO> {
        const petFromDb = await this.petRepository.findOne({
            where: {
                id: id
            },
            relations: {
                type: true,
                color: true,
                country: true,
                user: true
            }
        }).catch(() => {throw new InternalServerErrorException});

        if (!petFromDb) {
            throw new NotFoundException('Pet not found');
        }

        if (petFromDb.user.id !== userId) {
            throw new UnauthorizedException('Current user does not have acces to this pet');
        }

        const petDTO = this.petMapper.entityToDto(petFromDb);

        return petDTO;

    }

    async create(username: string, petUpdateDTO: PetUpdateDTO): Promise<PetDTO> {
        const typeFromDb = await this.typeRepository
                            .findOne({where: {animal: petUpdateDTO.type}})
                            .catch();
        const colorFromDb = await this.colorRepository
                            .findOne({where: {color: petUpdateDTO.color}})
                            .catch();
        const countryFromDb = await this.countryRepository
                            .findOne({where: {name: petUpdateDTO.country}})
                            .catch();
        const userFromDb = await this.userRepository
                            .findOne({where: {username: username}})
                            .catch(() => {throw new InternalServerErrorException('USER NOT FOUND/AUTH ERROR')});

        let petToSave = await this.petMapper.updateDtoToEntity(petUpdateDTO, userFromDb).catch();
        petToSave = {
            ...petToSave, 
            type: typeFromDb ? typeFromDb : new PetType(petUpdateDTO.type),
            color: colorFromDb ? colorFromDb : new Color(petUpdateDTO.color), 
            country: countryFromDb ? countryFromDb : new Country(petUpdateDTO.country),
            user: userFromDb
        }

        return this.petMapper.entityToDto(
            await this.petRepository.save(petToSave)
                .catch(() => {
                    throw new InternalServerErrorException('Error while saving pet')
                })
            );
    }

    async update(id: number, petUpdateDTO: PetUpdateDTO, userId: number): Promise<PetDTO> {
        const petFromDb = await this.petRepository.findOne({
            where: {id: id},
            relations: {
                type: true,
                color: true,
                country: true,
                user: true,
            }
        }).catch(() => {throw new InternalServerErrorException});

        if (!petFromDb) {
            throw new NotFoundException('Pet not found');
        }

        if (petFromDb.user.id !== userId) {
            throw new UnauthorizedException('Current user does not have acces to this pet');
        }

        if (petUpdateDTO.type != petFromDb.type.animal) {
            const typeFromDb = await this.typeRepository.findOne({where: {animal: petUpdateDTO.type}}).catch();
            console.log(typeFromDb)
            petFromDb.type = typeFromDb ? typeFromDb : new PetType(petUpdateDTO.type);
        }
        if (petUpdateDTO.color != petFromDb.color.color) {
            const colorFromDb = await this.colorRepository.findOne({where: {color: petUpdateDTO.color}}).catch();
            console.log(colorFromDb)
            petFromDb.color = colorFromDb ? colorFromDb : new Color(petUpdateDTO.color);
        }
        if (petUpdateDTO.country != petFromDb.country.name) {
            const countryFromDb = await this.countryRepository.findOne({where: {name: petUpdateDTO.country}}).catch();
            petFromDb.country = countryFromDb ? countryFromDb : new Country(petUpdateDTO.country);
        }

        if (petUpdateDTO.name != petFromDb.name) {
            petFromDb.name = petUpdateDTO.name;
        }
        
        if (petUpdateDTO.age != petFromDb.age) {
            petFromDb.age = petUpdateDTO.age;
        }

        return this.petMapper.entityToDto(
            await this.petRepository.save(petFromDb)
                .catch(() => {
                    throw new InternalServerErrorException('Error while saving pet')
                })
            );
    }

    async delete(id: number, userId: number): Promise<string> {
        const petFromDb = await this.petRepository.findOne({
            where: {id: id},
            relations: {
                type: true,
                color: true,
                country: true,
                user: true,
            }
        }).catch(() => {throw new InternalServerErrorException});
        
        if (petFromDb.user.id !== userId) {
            throw new UnauthorizedException('Current user does not have acces to this pet');
        }

        await this.petRepository.delete(id)
            .catch(() => {throw new InternalServerErrorException('Error while deleting pet')});
        
        return `Deleted id: ${id}`;
    }


    // async findAll(): Promise<PetDTO[]> {
    //     try {
    //         const petsFromDb = await this.petRepository.find({
    //             relations: {
    //                 type: true,
    //                 color: true,
    //                 country: true,
    //                 user: true,
    //             }
    //         }).catch();

    //         const petDTOs = this.petMapper.entitiesToDtos(petsFromDb);

    //         return petDTOs;

    //     } catch (err) {
    //         console.log(err);
    //         throw new InternalServerErrorException;
    //     }
    // }
}

