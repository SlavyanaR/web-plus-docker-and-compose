import { Column, Entity, OneToMany } from 'typeorm';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsUrl,
  Length,
} from 'class-validator';

import { DefaultEntity } from 'src/common/entities/default.entity';

import { Offer } from 'src/offers/entities/offer.entity';
import { Wish } from 'src/wishes/entities/wish.entity';
import { Wishlist } from 'src/wishlists/entities/wishlist.entity';

@Entity()
export class User extends DefaultEntity {
  // имя
  @Column({ unique: true })
  @Length(2, 30)
  @IsNotEmpty()
  username: string;

  // о себе
  @Column({ default: 'Пока ничего не рассказал о себе' })
  @Length(2, 200)
  @IsOptional()
  about: string;

  // аватар
  @Column({ default: 'https://i.pravatar.cc/300' })
  @IsUrl()
  @IsOptional()
  avatar: string;

  // почта
  @Column({ unique: true, select: false })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  // пароль
  @Column({ unique: true })
  @IsNotEmpty()
  password: string;

  // список желаемых подарков
  @OneToMany(() => Wish, (wish) => wish.owner)
  wishes: Wish[];

  // список подарков, на которые скидывается юзер
  @OneToMany(() => Offer, (offer) => offer.user)
  offers: Offer[];

  // список вишлистов, юзера
  @OneToMany(() => Wishlist, (wishlist) => wishlist.owner)
  wishlist: Wishlist[];
}
