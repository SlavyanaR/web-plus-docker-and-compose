import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
} from '@nestjs/common';

import { JwtGuard } from 'src/auth/guards/jwt.guard';

import { User } from './entities/user.entity';
import { ReqUser } from './users.decorator';
import { UsersService } from './users.service';

import { FindUsersDto } from './dto/find-users.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async findProfile(@ReqUser() user: User) {
    const profile = await this.usersService.findOneWithPasswordAndEmail(
      user.username,
    );
    //eslint-disable-next-line
    const { password, ...result } = profile;
    return result;
  }

  @Patch('me')
  async updateProfile(
    @ReqUser() user: User,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.usersService.updateOne(user.id, updateUserDto);
  }

  @Get(':username')
  findUserByUsername(@Param('username') username: string) {
    return this.usersService.findOneByUsername(username);
  }

  @Post('find')
  findAll(@Body() findUsersDto: FindUsersDto) {
    return this.usersService.findMany(findUsersDto);
  }

  @Get('me/wishes')
  getProfileWishes(@ReqUser() user: User) {
    return this.usersService.getUserWishesById(user.id);
  }

  @Get(':username/wishes')
  getUserWishesByUsername(@Param('username') username: string) {
    return this.usersService.getUserWishesByUsername(username);
  }
}
