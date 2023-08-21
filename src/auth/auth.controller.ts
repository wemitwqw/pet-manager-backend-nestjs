import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  UseGuards
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDTO } from 'src/dto/auth.dto';
import { Tokens } from 'src/types/tokens.type';
import { AuthGuard } from './auth.guard';

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

  @UseGuards(AuthGuard)
  @Get('logout')
  @HttpCode(HttpStatus.OK)
  logout(@Request() req: any) {
    const { sub } = req.user;
    return this.authService.logout(sub);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshToken() {
    return this.authService.refresh();
  }

  // @UseGuards(AuthGuard)
  @Get('profile')
  @HttpCode(HttpStatus.OK)
  getProfile(@Request() req: any) {
    return req.user;
  }
}
