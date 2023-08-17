import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { IsUrl, Length, MaxLength } from 'class-validator';

import { DefaultEntity } from 'src/common/entities/default.entity';

import { Wish } from '../../wishes/entities/wish.entity';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Wishlist extends DefaultEntity {
  @Column()
  @Length(1, 250)
  name: string;

  // описание подборки
  @Column({ default: '' })
  @MaxLength(1500)
  description: string;

  // обложка для подборки
  @Column()
  @IsUrl()
  image: string;

  @ManyToOne(() => User, (user) => user.wishlist)
  owner: User;

  // набор ссылок на подарки
  @ManyToMany(() => Wish)
  @JoinTable()
  items: Wish[];
}
