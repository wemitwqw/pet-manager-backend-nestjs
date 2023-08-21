import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/dao/user.entity';
import { UserMapper } from 'src/mapper/user.mapper';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [
    UserService,
    UserMapper
  ],
  exports: [
    TypeOrmModule.forFeature([User]), 
    UserService
  ]
})
export class UserModule {}
