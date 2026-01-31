import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';

interface OrderCompletedData {
  orderId: string;
}

interface OrderStatusChangedData {
  orderId: string;
  newStatus: string;
}

@Processor('order-events')
export class OrderEventsProcessor extends WorkerHost {
  private readonly logger = new Logger(OrderEventsProcessor.name);

  async process(job: Job): Promise<void> {
    switch (job.name) {
      case 'order-completed':
        await this.handleOrderCompleted(job.data as OrderCompletedData);
        break;
      case 'order-status-changed':
        await this.handleOrderStatusChanged(
          job.data as OrderStatusChangedData,
        );
        break;
      default:
        this.logger.warn(`Unknown job name: ${job.name}`);
    }
  }

  private async handleOrderCompleted(
    data: OrderCompletedData,
  ): Promise<void> {
    this.logger.log(`Processing order-completed for order ${data.orderId}`);
    // Future: send confirmation email, update analytics, notify warehouse
  }

  private async handleOrderStatusChanged(
    data: OrderStatusChangedData,
  ): Promise<void> {
    this.logger.log(
      `Processing order-status-changed for order ${data.orderId} -> ${data.newStatus}`,
    );
    // Future: send status update email, trigger fulfillment actions
  }
}
