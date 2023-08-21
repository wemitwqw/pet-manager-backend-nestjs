import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { PetService } from './pet.service';
import { PetUpdateDTO } from 'src/dto/pet-update.dto';
import { PetDTO } from 'src/dto/pet.dto';
// import { AuthGuard } from 'src/auth/auth.guard';
import { AuthorizedRequest } from 'src/types/authorized-request.model';

@Controller('pet')
export class PetController {
    constructor(private readonly petService: PetService) {}

    // @UseGuards(AuthGuard)
    @Get()
    @HttpCode(200)
    getPets(@Request() req: AuthorizedRequest): Promise<PetDTO[]> {
        const userId = req.user.sub;
        return this.petService.findAllByUser(userId);
    }

    // @UseGuards(AuthGuard)
    @Get(':id')
    @HttpCode(200)
    async getPetById(@Request() req: AuthorizedRequest, @Param('id') id: number): Promise<PetDTO> {
        const userId = req.user.sub;
        return this.petService.findById(id, userId);
    }

    // @UseGuards(AuthGuard)
    @Post()
    @HttpCode(201)
    async create(@Request() req: AuthorizedRequest, @Body() petUpdateDTO: PetUpdateDTO) {
        const username = req.user.username;
        return this.petService.create(username, petUpdateDTO);
    }

    // @UseGuards(AuthGuard)
    @Put(':id')
    @HttpCode(200)
    async update(@Request() req: AuthorizedRequest, @Param('id') id: number, @Body() createPetDTO: PetUpdateDTO) {
        const userId = req.user.sub;
        return this.petService.update(id, createPetDTO, userId);
    }

    // @UseGuards(AuthGuard)
    @Delete(':id')
    @HttpCode(200)
    delete(@Request() req: AuthorizedRequest, @Param('id') id: number): Promise<string>{
        const userId = req.user.sub;
        return this.petService.delete(id, userId);
    }
    
}
