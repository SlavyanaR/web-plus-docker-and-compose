import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { IsNumber, IsPositive, IsUrl, Length } from 'class-validator';

import { User } from 'src/users/entities/user.entity';
import { Offer } from 'src/offers/entities/offer.entity';
import { DefaultEntity } from 'src/common/entities/default.entity';

@Entity()
export class Wish extends DefaultEntity {
  @Column()
  @Length(1, 250)
  name: string;

  // ссылка на интернет-магазин
  @Column()
  @IsUrl()
  link: string;

  // валидность URL
  @Column()
  @IsUrl()
  image: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  @IsNumber()
  price: number;

  // сумма сбора
  @Column({ nullable: true })
  @IsNumber()
  raised: number;

  @Column({ default: '' })
  @Length(1, 1024)
  description: string;

  // ссылка на юзера, который добавил пожелание подарка
  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;

  // ссылки на заявки скинуться от других юзеров
  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];

  // cчётчик тех, кто скопировал подарок себе
  @Column({ default: 0 })
  @IsPositive()
  copied: number;
}
