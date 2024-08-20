import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegAuthDto, LoginAuthDto } from './dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from 'src/user/user.schema';
@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('login')
  @ApiCreatedResponse({
    description: 'The user has been successfully login.',
    type: User,
  })
  @ApiBadRequestResponse({
    description: 'The user cannot login.',
  })
  login(@Body() loginAuthDto: LoginAuthDto) {
    return this.authService.login(loginAuthDto);
  }
  @Post('signup')
  @ApiCreatedResponse({
    description: 'The user has been successfully created.',
    type: User,
  })
  @ApiBadRequestResponse({
    description: 'The user cannot register.',
  })
  async register(@Body() regAuthDto: RegAuthDto) {
    await this.authService.register(regAuthDto);
    return `register successfully`;
  }
}
