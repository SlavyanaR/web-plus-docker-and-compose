import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Wishlist } from './entities/wishlist.entity';
import { DeleteResult, Repository, UpdateResult } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { WishesService } from '../wishes/wishes.service';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private readonly wishlistRepository: Repository<Wishlist>,
    private readonly wishesService: WishesService,
  ) {}

  async create(
    createWishlistDto: CreateWishlistDto,
    owner: User,
  ): Promise<Wishlist> {
    const items = await this.wishesService.findMany(createWishlistDto.itemsId);

    if (!items.length) {
      throw new NotFoundException('Ни одного подарка не найдено');
    }

    const newWishlist = await this.wishlistRepository.create({
      ...createWishlistDto,
      items,
      owner,
    });

    return this.wishlistRepository.save(newWishlist);
  }

  async getWishlists(): Promise<Wishlist[]> {
    return this.wishlistRepository.find({
      relations: {
        owner: true,
        items: true,
      },
    });
  }

  async getById(id: number): Promise<Wishlist> {
    const wishlist = await this.wishlistRepository.findOne({
      where: {
        id,
      },
      relations: {
        owner: true,
        items: true,
      },
    });

    if (!wishlist) {
      throw new NotFoundException('Коллекция не найдена');
    }
    return wishlist;
  }

  async update(
    id: number,
    updateWishlistDto: UpdateWishlistDto,
    userId: number,
  ): Promise<UpdateResult> {
    const wish = await this.getById(id);

    if (wish.owner.id !== userId) {
      throw new ForbiddenException('Нельзя редактировать или удалять чужие коллекции');
    }

    return this.wishlistRepository.update(id, updateWishlistDto);
  }

  async remove(id: number, userId: number): Promise<DeleteResult> {
    const wish = await this.getById(id);

    if (wish.owner.id !== userId) {
      throw new ForbiddenException('Нельзя редактировать или удалять чужие коллекции');
    }

    return this.wishlistRepository.delete(id);
  }
}
