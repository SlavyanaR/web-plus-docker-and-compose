import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from 'src/users/entities/user.entity';

import { Wish } from 'src/wishes/entities/wish.entity';
import { WishesService } from 'src/wishes/wishes.service';

import { Offer } from './entities/offer.entity';
import { CreateOfferDto } from './dto/create-offer.dto';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offersRepository: Repository<Offer>,
    @InjectRepository(Wish)
    private readonly wishesRepository: Repository<Wish>,
    private readonly wishesService: WishesService,
  ) {}

  // создаем оффер
  async create(user: User, createOfferDto: CreateOfferDto) {
    const { itemId, amount, hidden } = createOfferDto;
    const wish = await this.wishesService.findWish(itemId);

    if (user.id === wish.owner.id) {
      throw new BadRequestException(
        'Можно вносить средства только на подарки других пользователей',
      );
    } else if (amount + wish.raised > wish.price) {
      throw new BadRequestException(
        'Сумма вносимых средств должна быть меньше стоимости подарка',
      );
    }

    const newOffer = this.offersRepository.create({
      amount,
      hidden,
      item: wish,
      user,
    });

    await this.wishesService.updateRaisedAmount(wish, amount);
    await this.offersRepository.save(newOffer);
    return newOffer;
  }

  // находим офферы
  findAll() {
    return this.offersRepository.find({
      relations: {
        user: true,
        item: true,
      },
    });
  }

  // находим оффер по id
  findOne(id: number) {
    return this.offersRepository.findOne({
      where: { id },
      relations: {
        user: true,
        item: true,
      },
    });
  }

  // удаляем оффер
  async removeOne(id: number) {
    await this.offersRepository.delete(id);
  }
}
