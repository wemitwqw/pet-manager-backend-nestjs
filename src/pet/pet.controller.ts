import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { PetService } from './pet.service';
import { PetUpdateDTO } from 'src/dto/petUpdate.dto';
import { PetDTO } from 'src/dto/pet.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('pet')
export class PetController {
    constructor(private readonly petService: PetService) {}

    @UseGuards(AuthGuard)
    @Get()
    @HttpCode(200)
    getPets(@Request() req: any): Promise<PetDTO[]> {
        const { id } = req.user;
        return this.petService.findAllByUser(id);
    }

    @UseGuards(AuthGuard)
    @Get(':id')
    @HttpCode(200)
    async getPetById(@Param('id') id: number, @Request() req: any): Promise<PetDTO> {
        const userId = req.user.id;
        return this.petService.findById(id, userId);
    }

    @UseGuards(AuthGuard)
    @Post()
    @HttpCode(201)
    async create(@Request() req: any, @Body() petUpdateDTO: PetUpdateDTO) {
        return this.petService.create(req, petUpdateDTO);
    }

    @UseGuards(AuthGuard)
    @Put(':id')
    @HttpCode(200)
    async update(@Param('id') id: number, @Body() createPetDTO: PetUpdateDTO) {
        return this.petService.update(id, createPetDTO);
    }

    @UseGuards(AuthGuard)
    @Delete(':id')
    @HttpCode(200)
    delete(@Param('id') id: number): Promise<string>{
        return this.petService.delete(id);
    }
    
}
