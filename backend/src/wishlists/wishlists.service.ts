import { BadRequestException, Injectable } from '@nestjs/common';
import { ForbiddenException } from '@nestjs/common/exceptions';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Wish } from 'src/wishes/entities/wish.entity';

import { Wishlist } from './entities/wishlist.entity';

import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistsRepository: Repository<Wishlist>,
  ) {}

  // создаем вишлист
  async create(id: number, createWishlistDto: CreateWishlistDto) {
    const { name, description, image, itemsId } = createWishlistDto;
    const items = itemsId.map((id) => ({ id } as Wish));
    const wishlist = this.wishlistsRepository.create({
      name,
      description,
      image,
      items,
      owner: { id },
    });
    return await this.wishlistsRepository.save(wishlist);
  }

  // находим вишлисты
  findAll() {
    return this.wishlistsRepository.find({
      relations: {
        owner: true,
        items: true,
      },
    });
  }

  // находим вишлист по id
  findOneById(id: number) {
    return this.wishlistsRepository.findOne({
      where: { id },
      relations: {
        owner: true,
        items: true,
      },
    });
  }

  // находим вишлист по имени
  findOne(query) {
    return this.wishlistsRepository.findOne(query);
  }

  // обновляем вишлист
  async updateOne(
    id: number,
    userId: number,
    updateWishlistDto: UpdateWishlistDto,
  ) {
    const wishlist = await this.findOne({
      where: { id },
      relations: { owner: true },
    });

    if (userId !== wishlist.owner.id) {
      throw new ForbiddenException(
        'Можно редактировать только свои списки подарков',
      );
    }
    const { itemsId, ...rest } = updateWishlistDto;
    const items = itemsId.map((id) => ({ id } as Wishlist));
    await this.wishlistsRepository.save({ id, items, ...rest });
    return this.findOneById(id);
  }

  // удаляем вишлист
  async removeOne(id: number, userId: number) {
    const wishlist = await this.findOne({
      where: { id },
      relations: { owner: true },
    });

    if (userId !== wishlist.owner.id) {
      throw new BadRequestException(
        'Вы можете удалять только свои списки подарков',
      );
    }
    await this.wishlistsRepository.delete(id);
    return wishlist;
  }
}
