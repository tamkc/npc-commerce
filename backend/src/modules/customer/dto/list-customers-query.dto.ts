import { IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto.js';

export class ListCustomersQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({
    description: 'Filter by customer group ID',
    format: 'uuid',
  })
  @IsOptional()
  @IsUUID()
  customerGroupId?: string;

  @ApiPropertyOptional({
    description: 'Search by name, email, or phone',
    example: 'john',
  })
  @IsOptional()
  @IsString()
  search?: string;
}
