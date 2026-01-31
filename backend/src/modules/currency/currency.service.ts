import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { CreateCurrencyDto } from './dto/create-currency.dto.js';
import { UpdateCurrencyDto } from './dto/update-currency.dto.js';
import { UpsertExchangeRateDto } from './dto/upsert-exchange-rate.dto.js';

@Injectable()
export class CurrencyService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.client.currency.findMany({ orderBy: { code: 'asc' } });
  }

  async findByCode(code: string) {
    const currency = await this.prisma.client.currency.findUnique({ where: { code } });
    if (!currency) throw new NotFoundException('Currency not found');
    return currency;
  }

  create(dto: CreateCurrencyDto) {
    return this.prisma.client.currency.create({ data: dto });
  }

  async update(code: string, dto: UpdateCurrencyDto) {
    await this.findByCode(code);
    return this.prisma.client.currency.update({ where: { code }, data: dto });
  }

  async remove(code: string) {
    await this.findByCode(code);
    return this.prisma.client.currency.delete({ where: { code } });
  }

  listExchangeRates() {
    return this.prisma.client.exchangeRate.findMany({
      include: { from: true, to: true },
    });
  }

  upsertExchangeRate(dto: UpsertExchangeRateDto) {
    return this.prisma.client.exchangeRate.upsert({
      where: {
        fromCurrency_toCurrency: {
          fromCurrency: dto.fromCurrency,
          toCurrency: dto.toCurrency,
        },
      },
      create: dto,
      update: { rate: dto.rate },
    });
  }
}
