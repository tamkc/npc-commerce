import { IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCustomerDto {
  @ApiPropertyOptional({ description: 'Phone number', example: '+1234567890' })
  @IsOptional()
  @IsString()
  phone?: string;

  @ApiPropertyOptional({
    description: 'Customer group ID',
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID()
  customerGroupId?: string;

  @ApiPropertyOptional({
    description: 'Arbitrary metadata JSON',
    example: { vip: true },
  })
  @IsOptional()
  metadata?: Record<string, unknown>;
}
