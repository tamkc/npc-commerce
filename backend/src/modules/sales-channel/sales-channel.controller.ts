import { Controller, Get, Post, Patch, Delete, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SalesChannelService } from './sales-channel.service.js';
import { CreateSalesChannelDto } from './dto/create-sales-channel.dto.js';
import { UpdateSalesChannelDto } from './dto/update-sales-channel.dto.js';
import { Roles } from '../../common/decorators/roles.decorator.js';

@ApiTags('Sales Channels')
@Controller('admin/sales-channels')
@Roles('ADMIN')
@ApiBearerAuth()
export class SalesChannelController {
  constructor(private salesChannelService: SalesChannelService) {}

  @Get() @ApiOperation({ summary: 'List sales channels' })
  findAll() { return this.salesChannelService.findAll(); }

  @Post() @ApiOperation({ summary: 'Create sales channel' })
  create(@Body() dto: CreateSalesChannelDto) { return this.salesChannelService.create(dto); }

  @Patch(':id') @ApiOperation({ summary: 'Update sales channel' })
  update(@Param('id') id: string, @Body() dto: UpdateSalesChannelDto) { return this.salesChannelService.update(id, dto); }

  @Delete(':id') @ApiOperation({ summary: 'Delete sales channel' })
  remove(@Param('id') id: string) { return this.salesChannelService.remove(id); }

  @Post(':id/products') @ApiOperation({ summary: 'Add products to channel' })
  addProducts(@Param('id') id: string, @Body() body: { productIds: string[] }) {
    return this.salesChannelService.addProducts(id, body.productIds);
  }

  @Delete(':id/products/:productId') @ApiOperation({ summary: 'Remove product from channel' })
  removeProduct(@Param('id') id: string, @Param('productId') productId: string) {
    return this.salesChannelService.removeProduct(id, productId);
  }
}
