import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { StockLocationService } from './stock-location.service.js';
import { CreateStockLocationDto } from './dto/create-stock-location.dto.js';
import { UpdateStockLocationDto } from './dto/update-stock-location.dto.js';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto.js';
import { Roles } from '../../common/decorators/roles.decorator.js';

@ApiTags('Stock Locations')
@Controller('admin/stock-locations')
@Roles('ADMIN')
@ApiBearerAuth()
export class StockLocationController {
  constructor(private stockLocationService: StockLocationService) {}

  @Get()
  @ApiOperation({ summary: 'List stock locations' })
  findAll(@Query() query: PaginationQueryDto) {
    return this.stockLocationService.findAll(query);
  }

  @Post()
  @ApiOperation({ summary: 'Create stock location' })
  create(@Body() dto: CreateStockLocationDto) {
    return this.stockLocationService.create(dto);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get stock location' })
  findById(@Param('id') id: string) {
    return this.stockLocationService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update stock location' })
  update(@Param('id') id: string, @Body() dto: UpdateStockLocationDto) {
    return this.stockLocationService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete stock location' })
  remove(@Param('id') id: string) {
    return this.stockLocationService.remove(id);
  }
}
