import { Global, Module, OnModuleInit } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { QueueService } from './queue.service';
import { StockReservationProcessor } from './processors/stock-reservation.processor';
import { OrderEventsProcessor } from './processors/order-events.processor';
import { InventoryModule } from '../inventory/inventory.module';

@Global()
@Module({
  imports: [
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        connection: {
          host: configService.get<string>('redis.host', 'localhost'),
          port: configService.get<number>('redis.port', 6379),
          password: configService.get<string>('redis.password'),
        },
      }),
    }),
    BullModule.registerQueue(
      { name: 'stock-reservation' },
      { name: 'order-events' },
    ),
    InventoryModule,
  ],
  providers: [QueueService, StockReservationProcessor, OrderEventsProcessor],
  exports: [QueueService],
})
export class QueueModule implements OnModuleInit {
  constructor(private readonly queueService: QueueService) {}

  async onModuleInit(): Promise<void> {
    await this.queueService.scheduleReservationCleanup();
  }
}
