import { Module } from '@nestjs/common';
import { PromotionService } from './promotion.service';
import { PromotionEngineService } from './promotion-engine.service';
import { PromotionController } from './promotion.controller';

@Module({
  controllers: [PromotionController],
  providers: [PromotionService, PromotionEngineService],
  exports: [PromotionService, PromotionEngineService],
})
export class PromotionModule {}
