import { Injectable } from "@nestjs/common";
import { Pet } from "src/dao/pet.entity";
import { PetDTO } from "src/dto/pet.dto";
import { PetUpdateDTO } from "src/dto/pet-update.dto";
import { User } from "src/dao/user.entity";

@Injectable()
export class PetMapper {
    public async entityToDto(entity: Pet): Promise<PetDTO> {
        const dto: PetDTO = ({
            id: entity.id,
            name: entity.name,
            age: entity.age,
            type: entity.type,
            color: entity.color,
            country: entity.country
        });
        return dto;
    }

    public async entitiesToDtos(entities: Pet[]): Promise<PetDTO[]> {
        const dtos: PetDTO[] = [];
        
        for (let entity of entities) {
            dtos.push(await this.entityToDto(entity).catch());
        }
    
        return dtos;
    }

    public async DtoToEntity(dto: PetDTO): Promise<Pet> {
        const entity: Pet = ({
            ...dto,
        });
        return entity;
    }

    public async DtosToEntities(dtos: PetDTO[]): Promise<Pet[]> {
        const entities: Pet[] = [];
        
        for (let dto of dtos) {
            entities.push(await this.DtoToEntity(dto).catch());
        }
    
        return entities;
    }

    public async updateDtoToEntity(dto: PetUpdateDTO, user: User): Promise<Pet> {
        const entity: Pet = ({
            ...dto,
            type: {animal: dto.type},
            color: {color: dto.color},
            country: {name: dto.country},
            user: user
        });
        return entity;
    }
}

