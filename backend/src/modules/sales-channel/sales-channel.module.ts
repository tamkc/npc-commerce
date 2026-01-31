import { Module } from '@nestjs/common';
import { SalesChannelService } from './sales-channel.service.js';
import { SalesChannelController } from './sales-channel.controller.js';

@Module({
  controllers: [SalesChannelController],
  providers: [SalesChannelService],
  exports: [SalesChannelService],
})
export class SalesChannelModule {}
