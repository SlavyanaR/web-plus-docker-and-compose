import { Column, Entity, ManyToOne } from 'typeorm';
import { IsPositive } from 'class-validator';

import { DefaultEntity } from 'src/common/entities/default.entity';

import { User } from 'src/users/entities/user.entity';
import { Wish } from 'src/wishes/entities/wish.entity';

@Entity()
export class Offer extends DefaultEntity {
  // id желающего скинуться
  @ManyToOne(() => User, (user) => user.offers)
  user: User;

  // ссылка на товар
  @ManyToOne(() => Wish, (wish) => wish.offers)
  item: Wish;

  // сумма заявки
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0,
  })
  @IsPositive()
  amount: number;

  // флаг анонимного скидывающегося
  @Column({ default: false })
  hidden: boolean;
}
