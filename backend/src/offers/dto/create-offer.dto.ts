import { IsBoolean, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';

export class CreateOfferDto {
  @IsNumber()
  @IsNotEmpty()
  itemId: number;

  // сумма заявки
  @IsPositive()
  @IsNotEmpty()
  amount: number;

  // флаг анонимного скидывающегося
  @IsBoolean()
  hidden: boolean;
}
