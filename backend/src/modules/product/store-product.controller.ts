import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { ProductService } from './product.service';
import { ProductQueryDto } from './dto/product-query.dto';

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
