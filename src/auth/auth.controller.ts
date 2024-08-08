import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegAuthDto } from './dto/reg-auth.dto';
import { LoginAuthDto } from './dto/login-auth.dto';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiTags,
} from '@nestjs/swagger';
import { User } from 'src/user/user.model';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(new ValidationPipe({ transform: true }))
  @Post('login')
  @ApiCreatedResponse({
    description: 'The user has been successfully login.',
    type: User,
  })
  @ApiBadRequestResponse({
    description: 'The user cannot login.',
  })
  Login(@Body() loginAuthDto: LoginAuthDto) {
    return this.authService.Login(loginAuthDto);
  }
  @UsePipes(ValidationPipe)
  @Post('signup')
  @ApiCreatedResponse({
    description: 'The user has been successfully created.',
    type: User,
  })
  @ApiBadRequestResponse({
    description: 'The user cannot register.',
  })
  Reg(@Body() regAuthDto: RegAuthDto) {
    return this.authService.Register(regAuthDto);
  }
}
