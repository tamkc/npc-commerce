import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { Decimal } from '../../../generated/prisma/runtime/library.js';

export interface TaxCalculation {
  taxRate: number;
  taxAmount: Decimal;
  totalWithTax: Decimal;
}

@Injectable()
export class TaxCalculatorService {
  constructor(private prisma: PrismaService) {}

  async calculateTax(
    amount: Decimal,
    regionId: string,
  ): Promise<TaxCalculation> {
    const defaultRate = await this.prisma.client.taxRate.findFirst({
      where: { regionId, isDefault: true },
    });

    const rate = defaultRate ? Number(defaultRate.rate) : 0;
    const taxAmount = new Decimal(Number(amount) * rate);
    const totalWithTax = new Decimal(Number(amount) + Number(taxAmount));

    return { taxRate: rate, taxAmount, totalWithTax };
  }
}
