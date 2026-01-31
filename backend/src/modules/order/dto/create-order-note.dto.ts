import { IsString, IsBoolean, IsOptional, IsNotEmpty } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateOrderNoteDto {
  @ApiProperty({ description: 'Note content' })
  @IsString()
  @IsNotEmpty()
  content!: string;

  @ApiPropertyOptional({ description: 'Whether the note is private (admin-only)', default: true })
  @IsOptional()
  @IsBoolean()
  isPrivate?: boolean = true;
}
