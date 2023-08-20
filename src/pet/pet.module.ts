import { Module } from '@nestjs/common';
import { PetService } from './pet.service';
import { PetController } from './pet.controller';
import { Pet } from 'src/dao/pet.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PetMapper } from '../mapper/pet.mapper';
import { PetType } from 'src/dao/type.entity';
import { Color } from 'src/dao/color.entity';
import { Country } from 'src/dao/country.entity';
import { User } from 'src/dao/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pet, PetType, Color, Country, User])],
  providers: [
    PetService,
    PetMapper
  ],
  controllers: [PetController],
  exports: [PetService]
})
export class PetModule {}