import { IsString, IsInt, IsOptional, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateInventoryLevelDto {
  @ApiProperty() @IsString() variantId!: string;
  @ApiProperty() @IsString() stockLocationId!: string;
  @ApiProperty() @IsInt() @Min(0) onHand!: number;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(0) lowStockThreshold?: number;
}
