import { Module } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { PricingService } from './pricing.service.js';
import { PriceCalculatorService } from './price-calculator.service.js';
import { PricingController } from './pricing.controller.js';

@Module({
  controllers: [PricingController],
  providers: [PrismaService, PricingService, PriceCalculatorService],
  exports: [PricingService, PriceCalculatorService],
})
export class PricingModule {}
