import { Controller, Get, Param, Query, ForbiddenException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { OrderService } from './order.service.js';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto.js';
import { CurrentUser, JwtPayload } from '../../common/decorators/current-user.decorator.js';

@ApiTags('Orders (Store)')
@ApiBearerAuth()
@Controller('store/orders')
export class StoreOrderController {
  constructor(private orderService: OrderService) {}

  @Get()
  @ApiOperation({ summary: 'List current customer orders' })
  findMyOrders(
    @CurrentUser() user: JwtPayload,
    @Query() query: PaginationQueryDto,
  ) {
    return this.orderService.findByCustomer(user.sub, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific order for the current customer' })
  async findMyOrder(
    @CurrentUser() user: JwtPayload,
    @Param('id') id: string,
  ) {
    const order = await this.orderService.findById(id);

    if (order.customerId !== user.sub) {
      throw new ForbiddenException('This order does not belong to you');
    }

    return order;
  }
}
