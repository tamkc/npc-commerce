import { IsEnum, IsNotEmpty, IsString, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ApiKeyType } from '../../../../generated/prisma/client.js';

export class CreateApiKeyDto {
  @ApiProperty({
    description: 'Human-readable name for the API key',
    example: 'My Store Key',
  })
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name!: string;

  @ApiProperty({
    description: 'Type of the API key',
    enum: ApiKeyType,
    example: 'STORE',
  })
  @IsNotEmpty()
  @IsEnum(ApiKeyType)
  type!: ApiKeyType;
}
