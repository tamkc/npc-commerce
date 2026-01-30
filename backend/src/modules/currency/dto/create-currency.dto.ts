import { IsString, IsInt, Length, Min, Max, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCurrencyDto {
  @ApiProperty({
    description: 'ISO 4217 currency code (3 uppercase letters)',
    example: 'USD',
    minLength: 3,
    maxLength: 3,
  })
  @IsString()
  @Length(3, 3, { message: 'Currency code must be exactly 3 characters' })
  @Matches(/^[A-Z]{3}$/, {
    message: 'Currency code must be 3 uppercase letters',
  })
  code!: string;

  @ApiProperty({ description: 'Currency name', example: 'US Dollar' })
  @IsString()
  name!: string;

  @ApiProperty({ description: 'Currency symbol', example: '$' })
  @IsString()
  symbol!: string;

  @ApiProperty({ description: 'Native currency symbol', example: '$' })
  @IsString()
  symbolNative!: string;

  @ApiProperty({
    description: 'Number of decimal digits',
    example: 2,
    minimum: 0,
    maximum: 8,
  })
  @IsInt()
  @Min(0)
  @Max(8)
  decimalDigits!: number;
}
