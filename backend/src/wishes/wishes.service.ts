import { BadRequestException, Injectable } from '@nestjs/common';
import { ForbiddenException } from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../users/entities/user.entity';

import { Wish } from './entities/wish.entity';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private readonly wishesRepository: Repository<Wish>,
  ) {}

  // заполняем поле ownerId в таблице бд
  async create(id: number, createWishDto: CreateWishDto) {
    const { name, link, image, price, description } = createWishDto;
    const wish = this.wishesRepository.create({
      name,
      link,
      image,
      price,
      description,
      raised: 0,
      owner: { id },
      offers: [],
    });
    await this.wishesRepository.save(wish);
  }

  // ищем подарок
  async findWish(id: number) {
    return await this.wishesRepository.findOne({
      where: { id },
      relations: {
        owner: true,
        offers: { user: true },
      },
    });
  }

  // обновляем подарок
  async updateOne(
    wishId: number,
    updateWishDto: UpdateWishDto,
    userId: number,
  ) {
    const wish = await this.findWish(wishId);
    if (userId !== wish.owner.id) {
      throw new ForbiddenException('Можно редактировать только свои подарки');
    }
    if (wish.raised > 0) {
      throw new BadRequestException(
        'Вы не можете редактировать этот подарок. Идет сбор средств.',
      );
    }
    return await this.wishesRepository.update(wishId, updateWishDto);
  }

  // удаляем подарок
  async removeOne(id: number, userId: number) {
    const wish = await this.findWish(id);

    if (userId !== wish.owner.id) {
      throw new BadRequestException('Вы можете удалять только свои подарки');
    }

    await this.wishesRepository.delete(id);
    return wish;
  }

  // копируем подарок
  async copyWish(id: number, user: User) {
    const wish = await this.findWish(id);
    await this.wishesRepository.update(id, { copied: wish.copied + 1 });
    const { name, link, image, price, description } = wish;
    const copiedWish = this.wishesRepository.create({
      name,
      link,
      image,
      price,
      description,
      raised: 0,
      owner: user,
    });
    return await this.wishesRepository.save(copiedWish);
  }

  // получаем топ подарков
  getTopWishes() {
    return this.wishesRepository.find({
      order: {
        copied: 'DESC',
      },
      take: 10,
      relations: {
        owner: true,
        offers: true,
      },
    });
  }

  // получаем последние подарки
  getLastWishes() {
    return this.wishesRepository.find({
      order: {
        createdAt: 'DESC',
      },
      take: 40,
      relations: {
        owner: true,
        offers: true,
      },
    });
  }

  // получаем сумму сбора
  updateRaisedAmount(wish: Wish, amount: number) {
    return this.wishesRepository.update(
      { id: wish.id },
      { raised: wish.raised + amount },
    );
  }
}
