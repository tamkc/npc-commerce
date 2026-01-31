import {
  IsString,
  IsOptional,
  IsArray,
  ValidateNested,
  IsInt,
  Min,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class FulfillmentItemDto {
  @ApiProperty({ description: 'Order item ID' })
  @IsString()
  orderItemId!: string;

  @ApiProperty({ description: 'Quantity to fulfill', minimum: 1 })
  @IsInt()
  @Min(1)
  quantity!: number;
}

export class CreateFulfillmentDto {
  @ApiProperty({ description: 'Order ID' })
  @IsString()
  orderId!: string;

  @ApiProperty({ description: 'Stock location ID' })
  @IsString()
  stockLocationId!: string;

  @ApiPropertyOptional({ description: 'Shipping method ID' })
  @IsOptional()
  @IsString()
  shippingMethodId?: string;

  @ApiProperty({ description: 'Items to fulfill', type: [FulfillmentItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FulfillmentItemDto)
  items!: FulfillmentItemDto[];

  @ApiPropertyOptional({ description: 'Tracking number' })
  @IsOptional()
  @IsString()
  trackingNumber?: string;

  @ApiPropertyOptional({ description: 'Tracking URL' })
  @IsOptional()
  @IsString()
  trackingUrl?: string;

  @ApiPropertyOptional({ description: 'Additional metadata' })
  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
