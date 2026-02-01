import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { PriceListType, PriceListStatus } from './create-price-list.dto';

export class UpdatePriceListDto {
  @ApiPropertyOptional({ description: 'Name of the price list' })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: 'Description of the price list' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    enum: PriceListType,
    description: 'Type of the price list',
  })
  @IsOptional()
  @IsEnum(PriceListType)
  type?: PriceListType;

  @ApiPropertyOptional({
    enum: PriceListStatus,
    description: 'Status of the price list',
  })
  @IsOptional()
  @IsEnum(PriceListStatus)
  status?: PriceListStatus;

  @ApiPropertyOptional({ description: 'Start date of the price list' })
  @IsOptional()
  @IsDateString()
  startsAt?: string;

  @ApiPropertyOptional({ description: 'End date of the price list' })
  @IsOptional()
  @IsDateString()
  endsAt?: string;
}
