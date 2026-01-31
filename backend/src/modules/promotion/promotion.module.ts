import { Module } from '@nestjs/common';
import { PromotionService } from './promotion.service.js';
import { PromotionEngineService } from './promotion-engine.service.js';
import { PromotionController } from './promotion.controller.js';

@Module({
  controllers: [PromotionController],
  providers: [PromotionService, PromotionEngineService],
  exports: [PromotionService, PromotionEngineService],
})
export class PromotionModule {}
