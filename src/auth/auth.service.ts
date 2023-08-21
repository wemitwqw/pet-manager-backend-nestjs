import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthDTO } from 'src/dto/auth.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ) {}

    async signIn(authDTO: AuthDTO) {
        const user = await this.userService.findByUsername(authDTO.username);
        
        if (user?.password !== authDTO.password) {
          throw new UnauthorizedException();
        }

        const payload = { sub: user.id, username: user.username };

        return {
          access_token: await this.jwtService.signAsync(payload),
        };
        
    }
}
