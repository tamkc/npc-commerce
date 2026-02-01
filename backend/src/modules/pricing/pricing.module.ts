import { Module } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import { PricingService } from './pricing.service';
import { PriceCalculatorService } from './price-calculator.service';
import { PricingController } from './pricing.controller';

@Module({
  controllers: [PricingController],
  providers: [PrismaService, PricingService, PriceCalculatorService],
  exports: [PricingService, PriceCalculatorService],
})
export class PricingModule {}
