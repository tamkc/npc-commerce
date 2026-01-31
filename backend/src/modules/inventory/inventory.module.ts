import { Module } from '@nestjs/common';
import { InventoryService } from './inventory.service.js';
import { StockReservationService } from './stock-reservation.service.js';
import { InventoryController } from './inventory.controller.js';

@Module({
  controllers: [InventoryController],
  providers: [InventoryService, StockReservationService],
  exports: [InventoryService, StockReservationService],
})
export class InventoryModule {}
