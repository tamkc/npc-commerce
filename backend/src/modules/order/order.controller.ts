import { Controller, Get, Post, Put, Param, Body, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OrderService } from './order.service.js';
import { OrderQueryDto } from './dto/order-query.dto.js';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto.js';
import { CreateOrderNoteDto } from './dto/create-order-note.dto.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import {
  CurrentUser,
  JwtPayload,
} from '../../common/decorators/current-user.decorator.js';

@ApiTags('Orders (Admin)')
@ApiBearerAuth()
@Roles('ADMIN')
@Controller('admin/orders')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Get()
  @ApiOperation({ summary: 'List orders with filters' })
  findAll(@Query() query: OrderQueryDto) {
    return this.orderService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get order by ID' })
  findById(@Param('id') id: string) {
    return this.orderService.findById(id);
  }

  @Put(':id/status')
  @ApiOperation({ summary: 'Update order status' })
  updateStatus(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto) {
    return this.orderService.updateStatus(id, dto.status);
  }

  @Post(':id/cancel')
  @ApiOperation({ summary: 'Cancel order' })
  cancel(@Param('id') id: string) {
    return this.orderService.cancel(id);
  }

  @Post(':id/notes')
  @ApiOperation({ summary: 'Add note to order' })
  addNote(
    @Param('id') id: string,
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateOrderNoteDto,
  ) {
    return this.orderService.addNote(id, user.sub, dto);
  }

  @Get(':id/notes')
  @ApiOperation({ summary: 'Get notes for order' })
  findNotes(@Param('id') id: string) {
    return this.orderService.findNotes(id);
  }
}
