import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { CreateFulfillmentDto } from './dto/create-fulfillment.dto.js';
import { UpdateFulfillmentDto } from './dto/update-fulfillment.dto.js';

@Injectable()
export class FulfillmentService {
  constructor(private prisma: PrismaService) {}

  async findByOrder(orderId: string) {
    return this.prisma.client.fulfillment.findMany({
      where: { orderId },
      include: { items: true, stockLocation: true, shippingMethod: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    const fulfillment = await this.prisma.client.fulfillment.findUnique({
      where: { id },
      include: {
        items: true,
        stockLocation: true,
        shippingMethod: true,
        order: true,
      },
    });
    if (!fulfillment) throw new NotFoundException('Fulfillment not found');
    return fulfillment;
  }

  async create(dto: CreateFulfillmentDto) {
    return this.prisma.client.$transaction(async (tx) => {
      const fulfillment = await tx.fulfillment.create({
        data: {
          orderId: dto.orderId,
          stockLocationId: dto.stockLocationId,
          shippingMethodId: dto.shippingMethodId,
          trackingNumber: dto.trackingNumber,
          trackingUrl: dto.trackingUrl,
          metadata: dto.metadata,
        },
      });

      if (dto.items && dto.items.length > 0) {
        await tx.fulfillmentItem.createMany({
          data: dto.items.map((item) => ({
            fulfillmentId: fulfillment.id,
            orderItemId: item.orderItemId,
            quantity: item.quantity,
          })),
        });
      }

      await this.updateOrderFulfillmentStatus(tx, dto.orderId);

      return tx.fulfillment.findUnique({
        where: { id: fulfillment.id },
        include: { items: true, stockLocation: true, shippingMethod: true },
      });
    });
  }

  async update(id: string, dto: UpdateFulfillmentDto) {
    await this.findById(id);
    return this.prisma.client.fulfillment.update({
      where: { id },
      data: {
        trackingNumber: dto.trackingNumber,
        trackingUrl: dto.trackingUrl,
        metadata: dto.metadata,
      },
      include: { items: true, stockLocation: true, shippingMethod: true },
    });
  }

  async ship(id: string) {
    const fulfillment = await this.findById(id);
    if (fulfillment.canceledAt) {
      throw new BadRequestException('Cannot ship a canceled fulfillment');
    }

    return this.prisma.client.$transaction(async (tx) => {
      const updated = await tx.fulfillment.update({
        where: { id },
        data: { shippedAt: new Date() },
        include: { items: true, stockLocation: true, shippingMethod: true },
      });

      await this.updateOrderFulfillmentStatus(tx, fulfillment.orderId);
      return updated;
    });
  }

  async deliver(id: string) {
    const fulfillment = await this.findById(id);
    if (fulfillment.canceledAt) {
      throw new BadRequestException('Cannot deliver a canceled fulfillment');
    }

    return this.prisma.client.$transaction(async (tx) => {
      const updated = await tx.fulfillment.update({
        where: { id },
        data: { deliveredAt: new Date() },
        include: { items: true, stockLocation: true, shippingMethod: true },
      });

      await this.updateOrderFulfillmentStatus(tx, fulfillment.orderId);
      return updated;
    });
  }

  async cancel(id: string) {
    const fulfillment = await this.findById(id);
    if (fulfillment.canceledAt) {
      throw new BadRequestException('Fulfillment already canceled');
    }

    return this.prisma.client.$transaction(async (tx) => {
      const updated = await tx.fulfillment.update({
        where: { id },
        data: { canceledAt: new Date() },
        include: { items: true, stockLocation: true, shippingMethod: true },
      });

      await this.updateOrderFulfillmentStatus(tx, fulfillment.orderId);
      return updated;
    });
  }

  private async updateOrderFulfillmentStatus(tx: any, orderId: string) {
    const fulfillments = await tx.fulfillment.findMany({
      where: { orderId, canceledAt: null },
      include: { items: true },
    });

    let status: string;

    if (fulfillments.length === 0) {
      status = 'NOT_FULFILLED';
    } else if (fulfillments.every((f: any) => f.deliveredAt)) {
      status = 'DELIVERED';
    } else if (fulfillments.every((f: any) => f.shippedAt)) {
      status = 'SHIPPED';
    } else if (fulfillments.some((f: any) => f.items.length > 0)) {
      status = 'PARTIALLY_FULFILLED';
    } else {
      status = 'NOT_FULFILLED';
    }

    await tx.order.update({
      where: { id: orderId },
      data: { fulfillmentStatus: status },
    });
  }
}
