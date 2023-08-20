import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserRequestDTO } from 'src/dto/userRequest.dto';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ) {}

    async signIn(userData: UserRequestDTO) {
        const user = await this.userService.findByUsername(userData.username);
        
        if (user?.password !== userData.password) {
          throw new UnauthorizedException();
        }

        const payload = { id: user.id, username: user.username };

        return {
          access_token: await this.jwtService.signAsync(payload),
        };
        
    }
}
