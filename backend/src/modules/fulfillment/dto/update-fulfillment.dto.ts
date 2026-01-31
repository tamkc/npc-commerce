import { IsString, IsOptional, IsObject } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateFulfillmentDto {
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
