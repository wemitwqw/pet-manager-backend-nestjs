import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Request,
  UseGuards
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDTO } from 'src/dto/auth.dto';
import { Tokens } from 'src/types/tokens.type';
import { AtGuard, RtGuard } from 'src/common/guard';
import { GetCurrentUser, GetCurrentUserId } from 'src/common/decorator';

@Controller('auth')
export class AuthController {

  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  signIn(@Body() authDTO: AuthDTO): Promise<Tokens> {
    return this.authService.signIn(authDTO);
  }

  @Post('register')
  @HttpCode(HttpStatus.OK)
  signUp(@Body() authDTO: AuthDTO): Promise<Tokens> {
    return this.authService.signUp(authDTO);
  }

  @UseGuards(AtGuard)
  @Get('logout')
  @HttpCode(HttpStatus.OK)
  logout(@GetCurrentUserId() userId: number) {
    return this.authService.logout(userId);
  }

  @UseGuards(RtGuard)
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshToken(
    @GetCurrentUserId() userId: number, 
    @GetCurrentUser('refreshToken') refreshToken: string
  ) {
    return this.authService.refreshTokens(userId, refreshToken);
  }
}
