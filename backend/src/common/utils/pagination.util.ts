import type { PaginationQueryDto } from '../dto/pagination-query.dto.js';

export function getPaginationParams(query: PaginationQueryDto): {
  skip: number;
  take: number;
} {
  const page = query.page ?? 1;
  const limit = query.limit ?? 20;
  return {
    skip: (page - 1) * limit,
    take: limit,
  };
}
