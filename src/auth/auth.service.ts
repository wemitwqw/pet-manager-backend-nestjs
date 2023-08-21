import { ConflictException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthDTO } from 'src/dto/auth.dto';
import { UserService } from 'src/user/user.service';

import * as bcrypt from 'bcrypt';
import { jwtConfig } from 'src/conf/jwt.config';
import { Tokens } from 'src/types/tokens.type';

@Injectable()
export class AuthService {
  constructor(
      private userService: UserService,
      private jwtService: JwtService
  ) {}
 
  async updateRtHashInUser(userId: number, rt: string) {
    const hash = await this.hashData(rt);
    await this.userService.updateRtHash(userId, hash);
  }

  async signIn(authDTO: AuthDTO): Promise<Tokens> {
    const user = await this.userService.findByUsername(authDTO.username)
      .catch(() => {throw new InternalServerErrorException('Error while signing in')});

    if (!user) {throw new NotFoundException('User not found')}

    const isMatch = await bcrypt.compare(authDTO.password, user?.password).catch();
    if (!isMatch) {
      throw new UnauthorizedException();
    }

    const tokens = await this.getTokens(user?.id, user?.username);
    await this.updateRtHashInUser(user.id, tokens.refresh_token);

    return tokens;
  }

  async signUp(authDTO: AuthDTO): Promise<Tokens> {
    if (
      await this.userService.existsByUsername(authDTO.username)
        .catch(() => {throw new InternalServerErrorException('Error while creating user')})
    ) {
      throw new ConflictException('User already exists');
    }

    const hash = await this.hashData(authDTO.password).catch();

    const savedUser = await this.userService.createUser(authDTO.username, hash)
      .catch(() => {throw new InternalServerErrorException('Error while creating user')});

    const tokens = await this.getTokens(savedUser?.id, savedUser?.username);
    await this.updateRtHashInUser(savedUser.id, tokens.refresh_token);
    
    return tokens;
  }

  async hashData(data: string): Promise<string> {
    return await bcrypt.hash(data, 10);
  } 

  async getTokens(userId: number, username: string) {
    const [at, rt] = await Promise.all([
      this.jwtService.signAsync({
        sub: userId,
        username: username,
      }, {
        secret: `${jwtConfig.secret}`,
        expiresIn: 60 * 15,
      }),
      this.jwtService.signAsync({
        sub: userId,
        username: username,
      }, {
        secret: `${jwtConfig.refreshSecret}`,
        expiresIn: 60 * 60 * 24 * 7,
      })
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    }
  }

  async logout(userId: number) {
    await this.userService.removeRtHash(userId).catch();
  }

  async refresh() {

  }
}
