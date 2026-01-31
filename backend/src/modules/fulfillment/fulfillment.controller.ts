import { Controller, Get, Post, Put, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { FulfillmentService } from './fulfillment.service.js';
import { CreateFulfillmentDto } from './dto/create-fulfillment.dto.js';
import { UpdateFulfillmentDto } from './dto/update-fulfillment.dto.js';
import { Roles } from '../../common/decorators/roles.decorator.js';

@ApiTags('Fulfillments')
@Controller('admin/fulfillments')
@Roles('ADMIN')
@ApiBearerAuth()
export class FulfillmentController {
  constructor(private fulfillmentService: FulfillmentService) {}

  @Get('order/:orderId')
  @ApiOperation({ summary: 'List fulfillments for an order' })
  findByOrder(@Param('orderId') orderId: string) {
    return this.fulfillmentService.findByOrder(orderId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get fulfillment by ID' })
  findById(@Param('id') id: string) {
    return this.fulfillmentService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create fulfillment' })
  create(@Body() dto: CreateFulfillmentDto) {
    return this.fulfillmentService.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update fulfillment tracking info' })
  update(@Param('id') id: string, @Body() dto: UpdateFulfillmentDto) {
    return this.fulfillmentService.update(id, dto);
  }

  @Post(':id/ship')
  @ApiOperation({ summary: 'Mark fulfillment as shipped' })
  ship(@Param('id') id: string) {
    return this.fulfillmentService.ship(id);
  }

  @Post(':id/deliver')
  @ApiOperation({ summary: 'Mark fulfillment as delivered' })
  deliver(@Param('id') id: string) {
    return this.fulfillmentService.deliver(id);
  }

  @Post(':id/cancel')
  @ApiOperation({ summary: 'Cancel fulfillment' })
  cancel(@Param('id') id: string) {
    return this.fulfillmentService.cancel(id);
  }
}
