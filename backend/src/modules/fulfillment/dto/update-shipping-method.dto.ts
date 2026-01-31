import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsObject,
  Min,
  IsNotEmpty,
} from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateShippingMethodDto {
  @ApiPropertyOptional({ description: 'Shipping method name' })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  name?: string;

  @ApiPropertyOptional({ description: 'Shipping price', minimum: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  price?: number;

  @ApiPropertyOptional({ description: 'Minimum order amount for this method' })
  @IsOptional()
  @IsNumber()
  minOrderAmount?: number;

  @ApiPropertyOptional({ description: 'Maximum order amount for this method' })
  @IsOptional()
  @IsNumber()
  maxOrderAmount?: number;

  @ApiPropertyOptional({ description: 'Whether the shipping method is active' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Additional metadata' })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
