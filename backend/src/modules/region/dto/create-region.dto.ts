import { IsString, IsBoolean, IsOptional, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRegionDto {
  @ApiProperty()
  @IsString()
  name!: string;
  @ApiProperty()
  @IsString()
  currencyCode!: string;
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  taxInclusivePricing?: boolean;
  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  countryCodes?: string[];
}
