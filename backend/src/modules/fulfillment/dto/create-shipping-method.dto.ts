import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsObject,
  Min,
  IsNotEmpty,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateShippingMethodDto {
  @ApiProperty({ description: 'Region ID' })
  @IsString()
  @IsNotEmpty()
  regionId!: string;

  @ApiProperty({ description: 'Shipping method name' })
  @IsString()
  @IsNotEmpty()
  name!: string;

  @ApiProperty({ description: 'Shipping price', minimum: 0 })
  @IsNumber()
  @Min(0)
  price!: number;

  @ApiPropertyOptional({ description: 'Minimum order amount for this method' })
  @IsOptional()
  @IsNumber()
  minOrderAmount?: number;

  @ApiPropertyOptional({ description: 'Maximum order amount for this method' })
  @IsOptional()
  @IsNumber()
  maxOrderAmount?: number;

  @ApiPropertyOptional({
    description: 'Whether the shipping method is active',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Additional metadata' })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
