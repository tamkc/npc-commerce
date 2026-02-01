import { Module } from '@nestjs/common';
import { StockLocationService } from './stock-location.service';
import { StockLocationController } from './stock-location.controller';

@Module({
  controllers: [StockLocationController],
  providers: [StockLocationService],
  exports: [StockLocationService],
})
export class StockLocationModule {}
