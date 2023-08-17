import { Controller, Post, UseGuards, Body } from '@nestjs/common';

import { User } from '../users/entities/user.entity';
import { ReqUser } from '../users/users.decorator';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';

import { AuthService } from './auth.service';

import { LocalGuard } from './guards/local.guard';

@Controller('/')
export class AuthController {
  constructor(
    private authService: AuthService,
    private usersService: UsersService,
  ) {}

  @UseGuards(LocalGuard)
  @Post('signin')
  signin(@ReqUser() user: User) {
    return this.authService.auth(user);
  }

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    return this.authService.auth(user);
  }
}
