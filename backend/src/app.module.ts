import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import config from '../config';
import { ConfigModule } from '@nestjs/config';

import { Wish } from './wishes/entities/wish.entity';
import { WishesModule } from './wishes/wishes.module';

import { Wishlist } from './wishlists/entities/wishlist.entity';
import { WishlistsModule } from './wishlists/wishlists.module';

import { Offer } from './offers/entities/offer.entity';
import { OffersModule } from './offers/offers.module';

import { User } from './users/entities/user.entity';
import { UsersModule } from './users/users.module';

import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({ load: [config] }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: config().db.host,
      port: config().db.port,
      username: config().db.username,
      password: config().db.password,

      database: config().db.database,
      entities: [User, Wish, Wishlist, Offer],
      synchronize: true,
    }),
    UsersModule,
    WishesModule,
    WishlistsModule,
    OffersModule,
    AuthModule,
  ],
})
export class AppModule {}
