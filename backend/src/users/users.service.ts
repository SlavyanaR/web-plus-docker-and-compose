import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

import { User } from './entities/user.entity';
import { FindUsersDto } from './dto/find-users.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
    private readonly configService: ConfigService,
  ) {}

  // создание пользователя
  async create(createUserDto: CreateUserDto) {
    const hash = await bcrypt.hash(
      createUserDto.password,
      this.configService.get('saltRound'),
    );
    const newUser = this.usersRepository.create({
      ...createUserDto,
      password: hash,
    });
    const user = await this.usersRepository.save(newUser);
    delete user.password;
    return user;
  }

  // найти всех пользователей
  async findAll() {
    return await this.usersRepository.find();
  }
  // найти пользователя
  async findOne(query) {
    return await this.usersRepository.findOne(query);
  }

  // найти пользователя по id
  async findOneById(id: number) {
    const user = this.findOne({
      where: { id },
    });
    if (!user) {
      throw new NotFoundException('такой пользователь не существует');
    }
    return user;
  }

  // найти пользователя по имени
  async findOneByUsername(username: string) {
    const user = this.findOne({
      where: { username },
    });
    if (!user) {
      throw new NotFoundException('такой пользователь не существует');
    }
    return user;
  }

  // найти пользователя по почте
  async findMany(findUsersDto: FindUsersDto) {
    const { query } = findUsersDto;
    return await this.usersRepository.find({
      where: [{ email: query }, { username: query }],
    });
  }

  // обновить инфу пользователя
  async updateOne(id: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      const hash = await bcrypt.hash(
        updateUserDto.password,
        this.configService.get('saltRound'),
      );
      updateUserDto = { ...updateUserDto, password: hash };
    }
    await this.usersRepository.update(id, updateUserDto);
    return this.findOneById(id);
  }

  // удалить пользователя
  async removeOne(id: number) {
    await this.usersRepository.delete({ id });
  }

  // найти пожелание пользователя по имени
  async getUserWishesByUsername(username: string) {
    const user = await this.findOne({
      where: { username },
      relations: {
        wishes: { owner: true, offers: true },
      },
    });
    return user.wishes;
  }

  // найти пожелание пользователя по id
  async getUserWishesById(id: number) {
    const user = await this.findOne({
      where: { id },
      relations: {
        wishes: { owner: true, offers: true },
      },
    });
    return user.wishes;
  }

  // найти пользователя
  async findOneWithPasswordAndEmail(username: string) {
    const user = await this.usersRepository.findOne({
      where: { username },
      select: [
        'id',
        'password',
        'email',
        'createdAt',
        'updatedAt',
        'about',
        'avatar',
      ],
    });
    if (!user) throw new NotFoundException('такой пользователь не существует');
    return user;
  }
}
