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
import { AuthGuard } from './auth.guard';

@Controller('auth')
export class AuthController {

  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  signIn(@Body() authDTO: AuthDTO) {
    return this.authService.signIn(authDTO);
  }

  @Post('register')
  @HttpCode(HttpStatus.OK)
  signUp(@Body() authDTO: AuthDTO) {
    return this.authService.signUp(authDTO);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  logout() {
    return this.authService.logout();
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  refreshToken() {
    return this.authService.refresh();
  }

  @UseGuards(AuthGuard)
  @Get('profile')
  @HttpCode(HttpStatus.OK)
  getProfile(@Request() req: any) {
    return req.user;
  }
}
