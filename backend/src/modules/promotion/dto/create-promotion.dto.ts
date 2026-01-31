import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsEnum,
  IsNumber,
  IsInt,
  IsBoolean,
  IsDateString,
  IsArray,
  ValidateNested,
  Min,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum PromotionType {
  PERCENTAGE = 'PERCENTAGE',
  FIXED = 'FIXED',
  FREE_SHIPPING = 'FREE_SHIPPING',
  BUY_X_GET_Y = 'BUY_X_GET_Y',
}

export enum PromotionConditionType {
  MIN_ORDER_AMOUNT = 'MIN_ORDER_AMOUNT',
  SPECIFIC_PRODUCTS = 'SPECIFIC_PRODUCTS',
  SPECIFIC_CATEGORIES = 'SPECIFIC_CATEGORIES',
  CUSTOMER_GROUP = 'CUSTOMER_GROUP',
  MIN_QUANTITY = 'MIN_QUANTITY',
}

export class PromotionConditionDto {
  @ApiProperty({ enum: PromotionConditionType, description: 'Condition type' })
  @IsEnum(PromotionConditionType)
  type!: PromotionConditionType;

  @ApiProperty({ description: 'Comparison operator (e.g. eq, gte, in)' })
  @IsString()
  operator!: string;

  @ApiProperty({ description: 'Condition value (JSON-compatible)' })
  value!: any;
}

export class CreatePromotionDto {
  @ApiPropertyOptional({ description: 'Unique discount code' })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiProperty({ description: 'Name of the promotion' })
  @IsString()
  name!: string;

  @ApiPropertyOptional({ description: 'Description of the promotion' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: PromotionType, description: 'Type of discount' })
  @IsEnum(PromotionType)
  type!: PromotionType;

  @ApiProperty({ description: 'Discount value', minimum: 0 })
  @IsNumber()
  @Min(0)
  value!: number;

  @ApiPropertyOptional({ description: 'Currency code for FIXED discounts' })
  @IsOptional()
  @IsString()
  currencyCode?: string;

  @ApiPropertyOptional({ description: 'Maximum total usage count' })
  @IsOptional()
  @IsInt()
  usageLimit?: number;

  @ApiPropertyOptional({ description: 'Maximum usage per customer' })
  @IsOptional()
  @IsInt()
  perCustomerLimit?: number;

  @ApiPropertyOptional({ description: 'Minimum order amount to qualify' })
  @IsOptional()
  @IsNumber()
  @Min(0)
  minOrderAmount?: number;

  @ApiPropertyOptional({
    description: 'Whether this promotion is applied automatically',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isAutomatic?: boolean;

  @ApiPropertyOptional({
    description: 'Whether the promotion is active',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ description: 'Start date of the promotion' })
  @IsDateString()
  startsAt!: string;

  @ApiPropertyOptional({ description: 'End date of the promotion' })
  @IsOptional()
  @IsDateString()
  endsAt?: string;

  @ApiPropertyOptional({
    description: 'Conditions for the promotion',
    type: [PromotionConditionDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PromotionConditionDto)
  conditions?: PromotionConditionDto[];
}
