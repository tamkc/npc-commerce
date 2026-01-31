import { IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCustomerGroupDto {
  @ApiProperty({ description: 'Group name', example: 'VIP' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name!: string;

  @ApiPropertyOptional({
    description: 'Group description',
    example: 'Very important customers',
  })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @ApiPropertyOptional({
    description: 'Arbitrary metadata JSON',
    example: { discountTier: 'gold' },
  })
  @IsOptional()
  metadata?: Record<string, unknown>;
}
