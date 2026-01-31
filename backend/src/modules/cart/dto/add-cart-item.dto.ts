import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class AddCartItemDto {
  @ApiProperty({ description: 'Product variant ID' })
  @IsNotEmpty()
  @IsString()
  variantId!: string;

  @ApiProperty({ description: 'Quantity to add', minimum: 1 })
  @IsInt()
  @Min(1)
  quantity!: number;
}
