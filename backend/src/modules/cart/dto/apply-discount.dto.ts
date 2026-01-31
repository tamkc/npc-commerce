import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class ApplyDiscountDto {
  @ApiProperty({ description: 'Discount code to apply' })
  @IsNotEmpty()
  @IsString()
  code!: string;
}
