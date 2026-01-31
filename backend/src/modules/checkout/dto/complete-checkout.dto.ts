import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export class ShippingAddressDto {
  @ApiProperty({ description: 'First name' })
  @IsNotEmpty()
  @IsString()
  firstName!: string;

  @ApiProperty({ description: 'Last name' })
  @IsNotEmpty()
  @IsString()
  lastName!: string;

  @ApiProperty({ description: 'Address line 1' })
  @IsNotEmpty()
  @IsString()
  addressLine1!: string;

  @ApiPropertyOptional({ description: 'Address line 2' })
  @IsOptional()
  @IsString()
  addressLine2?: string;

  @ApiProperty({ description: 'City' })
  @IsNotEmpty()
  @IsString()
  city!: string;

  @ApiPropertyOptional({ description: 'State or province' })
  @IsOptional()
  @IsString()
  state?: string;

  @ApiProperty({ description: 'Postal code' })
  @IsNotEmpty()
  @IsString()
  postalCode!: string;

  @ApiProperty({ description: 'Country code (e.g. US, GB)' })
  @IsNotEmpty()
  @IsString()
  countryCode!: string;

  @ApiPropertyOptional({ description: 'Phone number' })
  @IsOptional()
  @IsString()
  phone?: string;
}

export class CompleteCheckoutDto {
  @ApiProperty({ description: 'Cart ID to checkout' })
  @IsNotEmpty()
  @IsString()
  cartId!: string;

  @ApiProperty({ description: 'Shipping address', type: ShippingAddressDto })
  @ValidateNested()
  @Type(() => ShippingAddressDto)
  shippingAddress!: ShippingAddressDto;

  @ApiPropertyOptional({
    description: 'Billing address (defaults to shipping address)',
    type: ShippingAddressDto,
  })
  @IsOptional()
  @ValidateNested()
  @Type(() => ShippingAddressDto)
  billingAddress?: ShippingAddressDto;

  @ApiPropertyOptional({ description: 'Shipping method ID' })
  @IsOptional()
  @IsString()
  shippingMethodId?: string;

  @ApiPropertyOptional({ description: 'Email for order confirmation' })
  @IsOptional()
  @IsString()
  email?: string;
}
