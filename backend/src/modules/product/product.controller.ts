import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { ProductService } from './product.service.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { ProductQueryDto } from './dto/product-query.dto.js';

@ApiTags('Admin Products')
@ApiBearerAuth()
@Roles('ADMIN')
@Controller('admin/products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get()
  @ApiOperation({ summary: 'List products with filtering and pagination' })
  findAll(@Query() query: ProductQueryDto) {
    return this.productService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a product by ID' })
  findById(@Param('id') id: string) {
    return this.productService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new product' })
  create(@Body() dto: CreateProductDto) {
    return this.productService.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a product' })
  update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    return this.productService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product (soft delete)' })
  remove(@Param('id') id: string) {
    return this.productService.remove(id);
  }

  @Post(':id/tags')
  @ApiOperation({ summary: 'Add a tag to a product' })
  addTag(@Param('id') id: string, @Body('name') name: string) {
    return this.productService.addTag(id, name);
  }

  @Delete(':id/tags/:tagId')
  @ApiOperation({ summary: 'Remove a tag from a product' })
  removeTag(@Param('id') id: string, @Param('tagId') tagId: string) {
    return this.productService.removeTag(id, tagId);
  }

  @Post(':id/categories')
  @ApiOperation({ summary: 'Add a product to a category' })
  addToCategory(
    @Param('id') id: string,
    @Body('categoryId') categoryId: string,
  ) {
    return this.productService.addToCategory(id, categoryId);
  }

  @Delete(':id/categories/:categoryId')
  @ApiOperation({ summary: 'Remove a product from a category' })
  removeFromCategory(
    @Param('id') id: string,
    @Param('categoryId') categoryId: string,
  ) {
    return this.productService.removeFromCategory(id, categoryId);
  }
}
