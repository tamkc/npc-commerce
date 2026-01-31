import { IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto.js';

export class ProductQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ description: 'Filter by product status (DRAFT, PUBLISHED, ARCHIVED)' })
  @IsOptional()
  @IsString()
  status?: string;

  @ApiPropertyOptional({ description: 'Filter by category ID' })
  @IsOptional()
  @IsString()
  categoryId?: string;

  @ApiPropertyOptional({ description: 'Filter by sales channel ID' })
  @IsOptional()
  @IsString()
  salesChannelId?: string;

  @ApiPropertyOptional({ description: 'Search products by title' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Filter by tag name' })
  @IsOptional()
  @IsString()
  tag?: string;
}
