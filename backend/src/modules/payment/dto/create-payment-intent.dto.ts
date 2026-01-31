import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePaymentIntentDto {
  @ApiProperty({ description: 'Order ID to create payment for' })
  @IsNotEmpty()
  @IsString()
  orderId!: string;

  @ApiPropertyOptional({
    description: 'Currency code (defaults to order currency)',
  })
  @IsOptional()
  @IsString()
  currencyCode?: string;
}
