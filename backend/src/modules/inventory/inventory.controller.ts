import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { InventoryService } from './inventory.service.js';
import { StockReservationService } from './stock-reservation.service.js';
import { CreateInventoryLevelDto } from './dto/create-inventory-level.dto.js';
import { UpdateInventoryLevelDto } from './dto/update-inventory-level.dto.js';
import { CreateStockReservationDto } from './dto/create-stock-reservation.dto.js';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto.js';
import { Roles } from '../../common/decorators/roles.decorator.js';

@ApiTags('Inventory')
@Controller('admin/inventory')
@Roles('ADMIN')
@ApiBearerAuth()
export class InventoryController {
  constructor(
    private inventoryService: InventoryService,
    private reservationService: StockReservationService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List all inventory levels' })
  findAll(@Query() query: PaginationQueryDto) {
    return this.inventoryService.findAll(query);
  }

  @Get('low-stock')
  @ApiOperation({ summary: 'Get low stock alerts' })
  getLowStock() {
    return this.inventoryService.getLowStock();
  }

  @Get('variant/:variantId')
  @ApiOperation({ summary: 'Get inventory levels for a variant' })
  findByVariant(@Param('variantId') variantId: string) {
    return this.inventoryService.findByVariant(variantId);
  }

  @Get('location/:locationId')
  @ApiOperation({ summary: 'Get inventory levels for a stock location' })
  findByLocation(@Param('locationId') locationId: string) {
    return this.inventoryService.findByLocation(locationId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get inventory level by ID' })
  findById(@Param('id') id: string) {
    return this.inventoryService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create inventory level' })
  create(@Body() dto: CreateInventoryLevelDto) {
    return this.inventoryService.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update inventory level' })
  update(@Param('id') id: string, @Body() dto: UpdateInventoryLevelDto) {
    return this.inventoryService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete inventory level' })
  remove(@Param('id') id: string) {
    return this.inventoryService.remove(id);
  }

  @Post('reservations')
  @ApiOperation({ summary: 'Reserve stock' })
  reserve(@Body() dto: CreateStockReservationDto) {
    return this.reservationService.reserve(
      dto.variantId,
      dto.stockLocationId,
      dto.quantity,
      dto.orderId,
    );
  }

  @Post('reservations/:id/release')
  @ApiOperation({ summary: 'Release a stock reservation' })
  release(@Param('id') id: string) {
    return this.reservationService.release(id);
  }

  @Post('reservations/:id/confirm')
  @ApiOperation({
    summary: 'Confirm a stock reservation (deduct from on-hand)',
  })
  confirm(@Param('id') id: string) {
    return this.reservationService.confirm(id);
  }

  @Post('reservations/release-expired')
  @ApiOperation({ summary: 'Release all expired reservations' })
  releaseExpired() {
    return this.reservationService.releaseExpired();
  }
}
