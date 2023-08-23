import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards } from '@nestjs/common';
import { PetService } from './pet.service';
import { PetUpdateDTO } from 'src/dto/pet-update.dto';
import { PetDTO } from 'src/dto/pet.dto';
import { AtGuard } from 'src/common/guard';
import { GetCurrentUser, GetCurrentUserId } from 'src/common/decorator';

@Controller('pet')
export class PetController {
    constructor(private readonly petService: PetService) {}

    @UseGuards(AtGuard)
    @Get()
    @HttpCode(200)
    getPets(@GetCurrentUserId() userId: number): Promise<PetDTO[]> {
        return this.petService.findAllByUser(userId);
    }

    @UseGuards(AtGuard)
    @Get(':id')
    @HttpCode(200)
    async getPetById(@GetCurrentUserId() userId: number, @Param('id') id: number): Promise<PetDTO> {
        return this.petService.findById(id, userId);
    }

    @UseGuards(AtGuard)
    @Post()
    @HttpCode(201)
    async create(@GetCurrentUser('username') username: string, @Body() petUpdateDTO: PetUpdateDTO): Promise<PetDTO> {
        return this.petService.create(username, petUpdateDTO);
    }

    @UseGuards(AtGuard)
    @Put(':id')
    @HttpCode(200)
    async update(@GetCurrentUserId() userId: number, @Param('id') id: number, @Body() createPetDTO: PetUpdateDTO): Promise<PetDTO> {
        return this.petService.update(id, createPetDTO, userId);
    }

    @UseGuards(AtGuard)
    @Delete(':id')
    @HttpCode(200)
    async delete(@GetCurrentUserId() userId: number, @Param('id') id: number): Promise<string> {
        return this.petService.delete(id, userId);
    }
    
}
