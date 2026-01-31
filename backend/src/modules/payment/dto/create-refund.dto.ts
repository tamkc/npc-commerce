import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';

export class CreateRefundDto {
  @ApiProperty({ description: 'Payment ID to refund' })
  @IsNotEmpty()
  @IsString()
  paymentId!: string;

  @ApiProperty({ description: 'Amount to refund', minimum: 0.01 })
  @IsNumber()
  @Min(0.01)
  amount!: number;

  @ApiPropertyOptional({ description: 'Reason for the refund' })
  @IsOptional()
  @IsString()
  reason?: string;
}
