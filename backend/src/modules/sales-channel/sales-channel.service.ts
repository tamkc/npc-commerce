import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { CreateSalesChannelDto } from './dto/create-sales-channel.dto.js';
import { UpdateSalesChannelDto } from './dto/update-sales-channel.dto.js';

@Injectable()
export class SalesChannelService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.client.salesChannel.findMany({ orderBy: { name: 'asc' } });
  }

  async findById(id: string) {
    const channel = await this.prisma.client.salesChannel.findUnique({
      where: { id },
      include: { products: { include: { product: true } } },
    });
    if (!channel) throw new NotFoundException('Sales channel not found');
    return channel;
  }

  create(dto: CreateSalesChannelDto) {
    return this.prisma.client.salesChannel.create({ data: dto as Parameters<typeof this.prisma.client.salesChannel.create>[0]['data'] });
  }

  async update(id: string, dto: UpdateSalesChannelDto) {
    await this.findById(id);
    return this.prisma.client.salesChannel.update({ where: { id }, data: dto as Parameters<typeof this.prisma.client.salesChannel.update>[0]['data'] });
  }

  async remove(id: string) {
    await this.findById(id);
    return this.prisma.client.salesChannel.delete({ where: { id } });
  }

  async addProducts(channelId: string, productIds: string[]) {
    await this.findById(channelId);
    await this.prisma.client.productSalesChannel.createMany({
      data: productIds.map((pid) => ({ productId: pid, salesChannelId: channelId })),
      skipDuplicates: true,
    });
    return this.findById(channelId);
  }

  async removeProduct(channelId: string, productId: string) {
    await this.prisma.client.productSalesChannel.delete({
      where: { productId_salesChannelId: { productId, salesChannelId: channelId } },
    });
  }
}
