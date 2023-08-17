import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import * as bcrypt from 'bcrypt';

import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  // генерируем токен
  auth(user: User) {
    const payload = { sub: user.id };

    return { access_token: this.jwtService.sign(payload) };
  }

  // валидирвем введенный пароль с паролем в базе
  async validatePassword(username: string, password: string) {
    const user = await this.usersService.findOneWithPasswordAndEmail(username);

    if (user && (await bcrypt.compare(password, user.password))) {
      // eslint-disable-next-line
      const { password, ...result } = user;
      return result;
    }
    return null;
  }
}
