import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsDateString } from 'class-validator';

export enum PriceListType {
  SALE = 'SALE',
  OVERRIDE = 'OVERRIDE',
}

export enum PriceListStatus {
  ACTIVE = 'ACTIVE',
  DRAFT = 'DRAFT',
}

export class CreatePriceListDto {
  @ApiProperty({ description: 'Name of the price list' })
  @IsString()
  name!: string;

  @ApiPropertyOptional({ description: 'Description of the price list' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({
    enum: PriceListType,
    description: 'Type of the price list',
    default: PriceListType.SALE,
  })
  @IsOptional()
  @IsEnum(PriceListType)
  type?: PriceListType;

  @ApiPropertyOptional({
    enum: PriceListStatus,
    description: 'Status of the price list',
    default: PriceListStatus.DRAFT,
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
