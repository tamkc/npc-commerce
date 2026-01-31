import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { ORDER_STATUS_TRANSITIONS } from '../../common/constants/index.js';

@Injectable()
export class OrderLifecycleService {
  constructor(private prisma: PrismaService) {}

  async transition(orderId: string, newStatus: string) {
    const order = await this.prisma.client.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    const currentStatus = order.status;
    const allowedTransitions = ORDER_STATUS_TRANSITIONS[currentStatus];

    if (!allowedTransitions || !allowedTransitions.includes(newStatus)) {
      throw new BadRequestException(
        `Cannot transition order from ${currentStatus} to ${newStatus}`,
      );
    }

    const updateData: Record<string, unknown> = { status: newStatus };

    if (newStatus === 'CANCELLED') {
      updateData.canceledAt = new Date();
    }

    return this.prisma.client.order.update({
      where: { id: orderId },
      data: updateData,
      include: {
        items: true,
        customer: { include: { user: true } },
      },
    });
  }
}
