import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { jwtConfig } from 'src/conf/jwt.config';

@Module({
    imports: [
        UserModule,
        JwtModule.register({
            global: true,
            secret: `${jwtConfig.secret}`,
            signOptions: { expiresIn: 1000},
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService]
})
export class AuthModule {}
 