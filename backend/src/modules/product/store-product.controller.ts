import {
  Controller,
  Get,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator.js';
import { ProductService } from './product.service.js';
import { ProductQueryDto } from './dto/product-query.dto.js';

@ApiTags('Store Products')
@Controller('store/products')
export class StoreProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @Public()
  @ApiOperation({ summary: 'List published products (public)' })
  findAll(@Query() query: ProductQueryDto) {
    query.status = 'PUBLISHED';
    return this.productService.findAll(query);
  }

  @Get(':slug')
  @Public()
  @ApiOperation({ summary: 'Get a product by slug (public)' })
  findBySlug(@Param('slug') slug: string) {
    return this.productService.findBySlug(slug);
  }
}
