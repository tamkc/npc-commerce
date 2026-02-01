import { Module } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { StockReservationService } from './stock-reservation.service';
import { InventoryController } from './inventory.controller';

@Module({
  controllers: [InventoryController],
  providers: [InventoryService, StockReservationService],
  exports: [InventoryService, StockReservationService],
})
export class InventoryModule {}
