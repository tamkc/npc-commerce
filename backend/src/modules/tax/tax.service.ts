import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { CreateTaxRateDto } from './dto/create-tax-rate.dto.js';
import { UpdateTaxRateDto } from './dto/update-tax-rate.dto.js';

@Injectable()
export class TaxService {
  constructor(private prisma: PrismaService) {}

  findAll(regionId?: string) {
    return this.prisma.client.taxRate.findMany({
      where: regionId ? { regionId } : undefined,
      include: { region: true },
      orderBy: { name: 'asc' },
    });
  }

  async findById(id: string) {
    const rate = await this.prisma.client.taxRate.findUnique({
      where: { id },
      include: { region: true },
    });
    if (!rate) throw new NotFoundException('Tax rate not found');
    return rate;
  }

  create(dto: CreateTaxRateDto) {
    return this.prisma.client.taxRate.create({
      data: dto,
      include: { region: true },
    });
  }

  async update(id: string, dto: UpdateTaxRateDto) {
    await this.findById(id);
    return this.prisma.client.taxRate.update({
      where: { id },
      data: dto,
      include: { region: true },
    });
  }

  async remove(id: string) {
    await this.findById(id);
    return this.prisma.client.taxRate.delete({ where: { id } });
  }
}
