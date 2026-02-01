import { Module } from '@nestjs/common';
import { TaxService } from './tax.service';
import { TaxCalculatorService } from './tax-calculator.service';
import { TaxController } from './tax.controller';

@Module({
  controllers: [TaxController],
  providers: [TaxService, TaxCalculatorService],
  exports: [TaxService, TaxCalculatorService],
})
export class TaxModule {}
