import { PartialType } from '@nestjs/swagger';
import { CreateSalesChannelDto } from './create-sales-channel.dto.js';

export class UpdateSalesChannelDto extends PartialType(CreateSalesChannelDto) {}
