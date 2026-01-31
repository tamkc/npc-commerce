import {
  IsString,
  IsNumber,
  IsBoolean,
  IsOptional,
  Min,
  Max,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTaxRateDto {
  @ApiProperty() @IsString() regionId: string;
  @ApiProperty() @IsString() name: string;
  @ApiProperty({ description: 'Rate as decimal, e.g. 0.2 for 20%' })
  @IsNumber()
  @Min(0)
  @Max(1)
  rate: number;
  @ApiPropertyOptional() @IsOptional() @IsString() code?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isDefault?: boolean;
}
