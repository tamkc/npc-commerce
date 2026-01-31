import { Module } from '@nestjs/common';
import { TaxService } from './tax.service.js';
import { TaxCalculatorService } from './tax-calculator.service.js';
import { TaxController } from './tax.controller.js';

@Module({
  controllers: [TaxController],
  providers: [TaxService, TaxCalculatorService],
  exports: [TaxService, TaxCalculatorService],
})
export class TaxModule {}
