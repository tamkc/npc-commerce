import { Module } from '@nestjs/common';
import { StockLocationService } from './stock-location.service.js';
import { StockLocationController } from './stock-location.controller.js';

@Module({
  controllers: [StockLocationController],
  providers: [StockLocationService],
  exports: [StockLocationService],
})
export class StockLocationModule {}
