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
import { VariantService } from './variant.service.js';
import { CreateVariantDto } from './dto/create-variant.dto.js';
import { UpdateVariantDto } from './dto/update-variant.dto.js';

@ApiTags('Admin Product Variants')
@ApiBearerAuth()
@Roles('ADMIN')
@Controller('admin/products/:productId/variants')
export class VariantController {
  constructor(private readonly variantService: VariantService) {}

  @Get()
  @ApiOperation({ summary: 'List variants for a product' })
  findByProduct(@Param('productId') productId: string) {
    return this.variantService.findByProduct(productId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a variant by ID' })
  findById(@Param('id') id: string) {
    return this.variantService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new variant' })
  create(
    @Param('productId') productId: string,
    @Body() dto: CreateVariantDto,
  ) {
    dto.productId = productId;
    return this.variantService.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a variant' })
  update(@Param('id') id: string, @Body() dto: UpdateVariantDto) {
    return this.variantService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a variant (soft delete)' })
  remove(@Param('id') id: string) {
    return this.variantService.remove(id);
  }
}
