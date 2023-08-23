import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { AtStrategy } from 'src/strategy/at.strategy';
import { RtStrategy } from 'src/strategy/rt.stratery';

@Module({
    imports: [
        UserModule,
        JwtModule.register({}),
    ],
    controllers: [AuthController],
    providers: [AuthService, AtStrategy, RtStrategy]
})
export class AuthModule {}
 