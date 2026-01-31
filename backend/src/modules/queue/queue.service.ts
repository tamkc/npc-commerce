import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Injectable()
export class QueueService {
  private readonly logger = new Logger(QueueService.name);

  constructor(
    @InjectQueue('stock-reservation') private stockReservationQueue: Queue,
    @InjectQueue('order-events') private orderEventsQueue: Queue,
  ) {}

  async emitOrderCompleted(orderId: string): Promise<void> {
    await this.orderEventsQueue.add('order-completed', { orderId });
    this.logger.log(`Queued order-completed event for order ${orderId}`);
  }

  async emitOrderStatusChanged(
    orderId: string,
    newStatus: string,
  ): Promise<void> {
    await this.orderEventsQueue.add('order-status-changed', {
      orderId,
      newStatus,
    });
    this.logger.log(
      `Queued order-status-changed event for order ${orderId} -> ${newStatus}`,
    );
  }

  async scheduleReservationCleanup(): Promise<void> {
    // Add a repeatable job that runs every 5 minutes
    await this.stockReservationQueue.add(
      'release-expired',
      {},
      {
        repeat: {
          every: 5 * 60 * 1000, // 5 minutes
        },
        removeOnComplete: true,
        removeOnFail: 10,
      },
    );
    this.logger.log(
      'Scheduled recurring stock reservation cleanup (every 5 minutes)',
    );
  }
}
