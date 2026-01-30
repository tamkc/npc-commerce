import { IsString, IsNumber, Length, Matches, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpsertExchangeRateDto {
  @ApiProperty({
    description: 'Source currency code (3 uppercase letters)',
    example: 'USD',
  })
  @IsString()
  @Length(3, 3, { message: 'Currency code must be exactly 3 characters' })
  @Matches(/^[A-Z]{3}$/, { message: 'Currency code must be 3 uppercase letters' })
  fromCurrency!: string;

  @ApiProperty({
    description: 'Target currency code (3 uppercase letters)',
    example: 'EUR',
  })
  @IsString()
  @Length(3, 3, { message: 'Currency code must be exactly 3 characters' })
  @Matches(/^[A-Z]{3}$/, { message: 'Currency code must be 3 uppercase letters' })
  toCurrency!: string;

  @ApiProperty({
    description: 'Exchange rate (must be positive)',
    example: 0.85,
  })
  @IsNumber({ maxDecimalPlaces: 8 })
  @Min(0, { message: 'Exchange rate must be a positive number' })
  rate!: number;
}
