import {
  IsString,
  IsOptional,
  IsEnum,
  IsBoolean,
  IsObject,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ProductStatus } from './create-product.dto';

export class UpdateProductDto {
  @ApiPropertyOptional({ description: 'Product title' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: 'Product description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Product handle/slug' })
  @IsOptional()
  @IsString()
  handle?: string;

  @ApiPropertyOptional({
    description: 'Product status',
    enum: ProductStatus,
  })
  @IsOptional()
  @IsEnum(ProductStatus)
  status?: ProductStatus;

  @ApiPropertyOptional({ description: 'Whether this product is a gift card' })
  @IsOptional()
  @IsBoolean()
  isGiftCard?: boolean;

  @ApiPropertyOptional({ description: 'Additional metadata' })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
