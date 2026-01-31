import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateCartDto {
  @ApiPropertyOptional({ description: 'Customer ID for logged-in users' })
  @IsOptional()
  @IsString()
  customerId?: string;

  @ApiPropertyOptional({ description: 'Region ID' })
  @IsOptional()
  @IsString()
  regionId?: string;

  @ApiPropertyOptional({ description: 'Sales channel ID' })
  @IsOptional()
  @IsString()
  salesChannelId?: string;

  @ApiPropertyOptional({ description: 'Email for guest checkout' })
  @IsOptional()
  @IsString()
  email?: string;

  @ApiPropertyOptional({ description: 'Currency code', default: 'USD' })
  @IsOptional()
  @IsString()
  currencyCode?: string;
}
