import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateAddressDto {
  @ApiPropertyOptional({ description: 'Address label', example: 'Home' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  label?: string;

  @ApiProperty({ description: 'First name', example: 'John' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  firstName!: string;

  @ApiProperty({ description: 'Last name', example: 'Doe' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  lastName!: string;

  @ApiProperty({
    description: 'Address line 1',
    example: '123 Main Street',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(255)
  addressLine1!: string;

  @ApiPropertyOptional({
    description: 'Address line 2',
    example: 'Apt 4B',
  })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  addressLine2?: string;

  @ApiProperty({ description: 'City', example: 'New York' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  city!: string;

  @ApiPropertyOptional({ description: 'State / Province', example: 'NY' })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  state?: string;

  @ApiProperty({ description: 'Postal / ZIP code', example: '10001' })
  @IsNotEmpty()
  @IsString()
  @MaxLength(20)
  postalCode!: string;

  @ApiProperty({
    description: 'ISO 3166-1 alpha-2 country code',
    example: 'US',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(2)
  countryCode!: string;

  @ApiPropertyOptional({
    description: 'Phone number for this address',
    example: '+1234567890',
  })
  @IsOptional()
  @IsString()
  @MaxLength(30)
  phone?: string;

  @ApiPropertyOptional({
    description: 'Whether this is the default address',
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}
