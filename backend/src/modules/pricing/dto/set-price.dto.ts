import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNumber,
  IsOptional,
  IsInt,
  Min,
} from 'class-validator';

export class SetPriceDto {
  @ApiProperty({ description: 'ID of the price list' })
  @IsString()
  priceListId!: string;

  @ApiProperty({ description: 'ID of the product variant' })
  @IsString()
  variantId!: string;

  @ApiProperty({ description: 'Currency code (e.g. USD, EUR)' })
  @IsString()
  currencyCode!: string;

  @ApiProperty({ description: 'Price amount', minimum: 0 })
  @IsNumber()
  @Min(0)
  amount!: number;

  @ApiPropertyOptional({
    description: 'Minimum quantity for this price to apply',
    default: 1,
    minimum: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  minQuantity?: number;
}
