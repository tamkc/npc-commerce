import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { CreateVariantDto } from './dto/create-variant.dto.js';
import { UpdateVariantDto } from './dto/update-variant.dto.js';

@Injectable()
export class VariantService {
  constructor(private readonly prisma: PrismaService) {}

  async findByProduct(productId: string) {
    return this.prisma.client.productVariant.findMany({
      where: { productId },
      orderBy: { position: 'asc' },
      include: {
        optionValues: true,
      },
    });
  }

  async findById(id: string) {
    const variant = await this.prisma.client.productVariant.findUnique({
      where: { id },
      include: {
        optionValues: true,
      },
    });

    if (!variant) {
      throw new NotFoundException(`Variant with ID "${id}" not found`);
    }

    return variant;
  }

  async create(dto: CreateVariantDto) {
    return this.prisma.client.productVariant.create({
      data: {
        productId: dto.productId,
        title: dto.title,
        sku: dto.sku,
        barcode: dto.barcode,
        price: dto.price,
        compareAtPrice: dto.compareAtPrice,
        costPrice: dto.costPrice,
        weight: dto.weight,
        weightUnit: dto.weightUnit,
        position: dto.position ?? 0,
        manageInventory: dto.manageInventory ?? true,
        metadata: dto.metadata ?? {},
      },
      include: {
        optionValues: true,
      },
    });
  }

  async update(id: string, dto: UpdateVariantDto) {
    await this.findById(id);

    return this.prisma.client.productVariant.update({
      where: { id },
      data: {
        ...(dto.title !== undefined && { title: dto.title }),
        ...(dto.sku !== undefined && { sku: dto.sku }),
        ...(dto.barcode !== undefined && { barcode: dto.barcode }),
        ...(dto.price !== undefined && { price: dto.price }),
        ...(dto.compareAtPrice !== undefined && {
          compareAtPrice: dto.compareAtPrice,
        }),
        ...(dto.costPrice !== undefined && { costPrice: dto.costPrice }),
        ...(dto.weight !== undefined && { weight: dto.weight }),
        ...(dto.weightUnit !== undefined && { weightUnit: dto.weightUnit }),
        ...(dto.position !== undefined && { position: dto.position }),
        ...(dto.manageInventory !== undefined && {
          manageInventory: dto.manageInventory,
        }),
        ...(dto.metadata !== undefined && { metadata: dto.metadata }),
      },
      include: {
        optionValues: true,
      },
    });
  }

  async remove(id: string) {
    await this.findById(id);

    return this.prisma.client.productVariant.delete({
      where: { id },
    });
  }
}
