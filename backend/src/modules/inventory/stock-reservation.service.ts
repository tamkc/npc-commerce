import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';

@Injectable()
export class StockReservationService {
  constructor(private prisma: PrismaService) {}

  async reserve(
    variantId: string,
    stockLocationId: string,
    quantity: number,
    orderId?: string,
  ) {
    return this.prisma.client.$transaction(async (tx) => {
      const level = await tx.inventoryLevel.findUnique({
        where: {
          variantId_stockLocationId: { variantId, stockLocationId },
        },
      });

      if (!level) {
        throw new NotFoundException('Inventory level not found');
      }
      if (level.available < quantity) {
        throw new BadRequestException(
          `Insufficient stock: available ${level.available}, requested ${quantity}`,
        );
      }

      await tx.inventoryLevel.update({
        where: { id: level.id },
        data: {
          available: { decrement: quantity },
          reserved: { increment: quantity },
        },
      });

      const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
      return tx.stockReservation.create({
        data: { variantId, stockLocationId, quantity, orderId, expiresAt },
      });
    });
  }

  async release(reservationId: string) {
    return this.prisma.client.$transaction(async (tx) => {
      const reservation = await tx.stockReservation.findUnique({
        where: { id: reservationId },
      });
      if (!reservation || reservation.releasedAt) {
        throw new NotFoundException(
          'Reservation not found or already released',
        );
      }

      await tx.inventoryLevel.update({
        where: {
          variantId_stockLocationId: {
            variantId: reservation.variantId,
            stockLocationId: reservation.stockLocationId,
          },
        },
        data: {
          available: { increment: reservation.quantity },
          reserved: { decrement: reservation.quantity },
        },
      });

      return tx.stockReservation.update({
        where: { id: reservationId },
        data: { releasedAt: new Date() },
      });
    });
  }

  async confirm(reservationId: string) {
    return this.prisma.client.$transaction(async (tx) => {
      const reservation = await tx.stockReservation.findUnique({
        where: { id: reservationId },
      });
      if (!reservation || reservation.releasedAt) {
        throw new NotFoundException(
          'Reservation not found or already released',
        );
      }

      await tx.inventoryLevel.update({
        where: {
          variantId_stockLocationId: {
            variantId: reservation.variantId,
            stockLocationId: reservation.stockLocationId,
          },
        },
        data: {
          onHand: { decrement: reservation.quantity },
          reserved: { decrement: reservation.quantity },
        },
      });

      return tx.stockReservation.update({
        where: { id: reservationId },
        data: { releasedAt: new Date() },
      });
    });
  }

  async releaseExpired() {
    const expired = await this.prisma.client.stockReservation.findMany({
      where: { expiresAt: { lt: new Date() }, releasedAt: null },
    });

    for (const reservation of expired) {
      await this.release(reservation.id);
    }

    return { released: expired.length };
  }
}
