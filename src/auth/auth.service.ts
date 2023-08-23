import { ConflictException, ForbiddenException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthDTO } from 'src/dto/auth.dto';
import { UserService } from 'src/user/user.service';

import * as bcrypt from 'bcrypt';
import { Tokens } from 'src/types/tokens.type';
import { createHash } from 'crypto';

@Injectable()
export class AuthService {
  constructor(
      private userService: UserService,
      private jwtService: JwtService
  ) {}
 
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

  async logout(userId: number) {
    await this.userService.removeRtHash(userId).catch();
  }

  async refreshTokens(userId: number, rt: string) {
    const userFromDb = await this.userService.findById(userId).catch();
    if (!userFromDb || !userFromDb.hashedRt) {throw new ForbiddenException('Refresh token not eligible for refresh')}
    
    const hashedRt = this.encryptInSHA256(rt);
    if (hashedRt !== userFromDb.hashedRt) {throw new ForbiddenException('Refresh token not eligible for refresh')}

    const tokens = await this.getTokens(userFromDb?.id, userFromDb?.username);
    await this.updateRtHashInUser(userFromDb.id, tokens.refresh_token);
    
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
        secret: `${process.env.JWT_SECRET}`,
        expiresIn: 60 * 15,
      }),
      this.jwtService.signAsync({
        sub: userId,
        username: username,
      }, {
        secret: `${process.env.JWT_REFRESH_SECRET}`,
        expiresIn: 60 * 60 * 24 * 7,
      })
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    }
  }

  encryptInSHA256(rt: string): string {
    const hash = createHash('sha256');
    hash.update(rt);
    return hash.digest("base64");
  }

  async updateRtHashInUser(userId: number, rt: string) {
    const hash = createHash('sha256');
    hash.update(rt);
    const newHashedRt = hash.digest("base64");
    
    await this.userService.updateRtHash(userId, newHashedRt);
  }
}