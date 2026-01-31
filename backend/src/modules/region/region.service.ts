import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { CreateRegionDto } from './dto/create-region.dto.js';
import { UpdateRegionDto } from './dto/update-region.dto.js';

@Injectable()
export class RegionService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.client.region.findMany({
      include: { currency: true, countries: true },
      orderBy: { name: 'asc' },
    });
  }

  async findById(id: string) {
    const region = await this.prisma.client.region.findUnique({
      where: { id },
      include: { currency: true, countries: true, taxRates: true, shippingMethods: true },
    });
    if (!region) throw new NotFoundException('Region not found');
    return region;
  }

  async create(dto: CreateRegionDto) {
    const { countryCodes, ...data } = dto;
    return this.prisma.client.region.create({
      data: {
        ...data,
        countries: countryCodes?.length
          ? { createMany: { data: countryCodes.map((c) => ({ countryCode: c })) } }
          : undefined,
      },
      include: { currency: true, countries: true },
    });
  }

  async update(id: string, dto: UpdateRegionDto) {
    await this.findById(id);
    const { countryCodes, ...data } = dto;
    return this.prisma.client.region.update({
      where: { id },
      data,
      include: { currency: true, countries: true },
    });
  }

  async remove(id: string) {
    await this.findById(id);
    return this.prisma.client.region.delete({ where: { id } });
  }

  async addCountries(id: string, countryCodes: string[]) {
    await this.findById(id);
    await this.prisma.client.regionCountry.createMany({
      data: countryCodes.map((code) => ({ regionId: id, countryCode: code })),
      skipDuplicates: true,
    });
    return this.findById(id);
  }

  async removeCountry(id: string, countryCode: string) {
    await this.prisma.client.regionCountry.delete({
      where: { regionId_countryCode: { regionId: id, countryCode } },
    });
    return this.findById(id);
  }
}
