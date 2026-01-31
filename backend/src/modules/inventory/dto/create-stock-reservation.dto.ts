import { IsString, IsInt, IsOptional, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateStockReservationDto {
  @ApiProperty() @IsString() variantId!: string;
  @ApiProperty() @IsString() stockLocationId!: string;
  @ApiProperty() @IsInt() @Min(1) quantity!: number;
  @ApiPropertyOptional() @IsOptional() @IsString() orderId?: string;
}
