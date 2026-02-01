import { ApiPropertyOptional } from '@nestjs/swagger';
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
import {
  PromotionType,
  PromotionConditionDto,
} from './create-promotion.dto';

export class UpdatePromotionDto {
  @ApiPropertyOptional({ description: 'Unique discount code' })
  @IsOptional()
  @IsString()
  code?: string;

  @ApiPropertyOptional({ description: 'Name of the promotion' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Description of the promotion' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: PromotionType, description: 'Type of discount' })
  @IsOptional()
  @IsEnum(PromotionType)
  type?: PromotionType;

  @ApiPropertyOptional({ description: 'Discount value', minimum: 0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  value?: number;

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
  })
  @IsOptional()
  @IsBoolean()
  isAutomatic?: boolean;

  @ApiPropertyOptional({ description: 'Whether the promotion is active' })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Start date of the promotion' })
  @IsOptional()
  @IsDateString()
  startsAt?: string;

  @ApiPropertyOptional({ description: 'End date of the promotion' })
  @IsOptional()
  @IsDateString()
  endsAt?: string;

  @ApiPropertyOptional({
    description: 'Conditions for the promotion (replaces existing)',
    type: [PromotionConditionDto],
  })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PromotionConditionDto)
  conditions?: PromotionConditionDto[];
}
