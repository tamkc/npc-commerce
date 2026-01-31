import { IsString, IsBoolean, IsOptional, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSalesChannelDto {
  @ApiProperty() @IsString() name!: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional({ enum: ['WEB', 'MOBILE', 'POS'] }) @IsOptional() @IsEnum(['WEB', 'MOBILE', 'POS']) type?: string;
  @ApiPropertyOptional() @IsOptional() @IsBoolean() isActive?: boolean;
}
