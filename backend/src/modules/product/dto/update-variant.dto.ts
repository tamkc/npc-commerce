import {
  IsString,
  IsOptional,
  IsNumber,
  IsInt,
  IsBoolean,
  IsObject,
  Min,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateVariantDto {
  @ApiPropertyOptional({ description: 'Variant title' })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional({ description: 'Stock keeping unit' })
  @IsOptional()
  @IsString()
  sku?: string;

  @ApiPropertyOptional({ description: 'Barcode (EAN, UPC, etc.)' })
  @IsOptional()
  @IsString()
  barcode?: string;

  @ApiPropertyOptional({ description: 'Variant price', minimum: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiPropertyOptional({
    description: 'Compare-at price for showing discounts',
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  compareAtPrice?: number;

  @ApiPropertyOptional({ description: 'Cost price for profit calculations' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  costPrice?: number;

  @ApiPropertyOptional({ description: 'Weight of the variant' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  weight?: number;

  @ApiPropertyOptional({ description: 'Unit of weight (kg, lb, oz, g)' })
  @IsOptional()
  @IsString()
  weightUnit?: string;

  @ApiPropertyOptional({ description: 'Sort position' })
  @IsOptional()
  @IsInt()
  position?: number;

  @ApiPropertyOptional({
    description: 'Whether inventory is managed for this variant',
  })
  @IsOptional()
  @IsBoolean()
  manageInventory?: boolean;

  @ApiPropertyOptional({ description: 'Additional metadata' })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
