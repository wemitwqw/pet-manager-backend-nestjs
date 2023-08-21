import { ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthDTO } from 'src/dto/auth.dto';
import { UserDTO } from 'src/dto/user.dto';
import { UserService } from 'src/user/user.service';

import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService
    ) {}

    async signIn(authDTO: AuthDTO) {
        const user = await this.userService.findByUsername(authDTO.username)
          .catch(() => {throw new InternalServerErrorException('Error while signing in')});

        if (!user) {throw new NotFoundException('User not found')}

        const isMatch = await bcrypt.compare(authDTO.password, user?.password);
        if (!isMatch) {
          throw new UnauthorizedException();
        }

        const payload = { sub: user.id, username: user.username };

        return {
          access_token: await this.jwtService.signAsync(payload),
        };
    }

    async signUp(authDTO: AuthDTO): Promise<UserDTO> {
      if (
        await this.userService.existsByUsername(authDTO.username)
          .catch(() => {throw new InternalServerErrorException('Error while creating user')})
      ) {
        throw new ConflictException('User already exists');
      }

      const hash = await bcrypt.hash(authDTO.password, 10);

      return await this.userService.createUser(authDTO.username, hash)
        .catch(() => {throw new InternalServerErrorException('Error while creating user')});
    }

    async logout() {

    }

    async refresh() {

    }
}
