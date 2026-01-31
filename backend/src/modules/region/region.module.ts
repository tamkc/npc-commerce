import { Module } from '@nestjs/common';
import { RegionService } from './region.service.js';
import { RegionController } from './region.controller.js';

@Module({
  controllers: [RegionController],
  providers: [RegionService],
  exports: [RegionService],
})
export class RegionModule {}
