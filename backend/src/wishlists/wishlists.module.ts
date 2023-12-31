import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Wishlist } from './entities/wishlist.entity';
import { WishlistsService } from './wishlists.service';
import { WishlistsController } from './wishlists.controller';

@Module({
  controllers: [WishlistsController],
  providers: [WishlistsService],
  imports: [TypeOrmModule.forFeature([Wishlist])],
  exports: [WishlistsService],
})
export class WishlistsModule {}
