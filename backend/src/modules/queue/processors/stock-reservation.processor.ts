import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Logger } from '@nestjs/common';
import { Job } from 'bullmq';
import { StockReservationService } from '../../inventory/stock-reservation.service';

@Processor('stock-reservation')
export class StockReservationProcessor extends WorkerHost {
  private readonly logger = new Logger(StockReservationProcessor.name);

  constructor(
    private readonly stockReservationService: StockReservationService,
  ) {
    super();
  }

  async process(job: Job): Promise<void> {
    switch (job.name) {
      case 'release-expired':
        await this.handleReleaseExpired();
        break;
      default:
        this.logger.warn(`Unknown job name: ${job.name}`);
    }
  }

  private async handleReleaseExpired(): Promise<void> {
    try {
      const result = await this.stockReservationService.releaseExpired();
      if (result.released > 0) {
        this.logger.log(
          `Released ${result.released} expired stock reservation(s)`,
        );
      }
    } catch (error) {
      this.logger.error(`Failed to release expired reservations: ${error}`);
      throw error;
    }
  }
}
