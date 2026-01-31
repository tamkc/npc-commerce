import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { CategoryService } from './category.service.js';
import { CreateCategoryDto } from './dto/create-category.dto.js';
import { UpdateCategoryDto } from './dto/update-category.dto.js';

@ApiTags('Admin Categories')
@ApiBearerAuth()
@Roles('ADMIN')
@Controller('admin/categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  @ApiOperation({ summary: 'List all categories as a tree' })
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a category by ID' })
  findById(@Param('id') id: string) {
    return this.categoryService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new category' })
  create(@Body() dto: CreateCategoryDto) {
    return this.categoryService.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a category' })
  update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    return this.categoryService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a category (soft delete)' })
  remove(@Param('id') id: string) {
    return this.categoryService.remove(id);
  }
}
