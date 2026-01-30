import { PartialType } from '@nestjs/swagger';
import { CreateStockLocationDto } from './create-stock-location.dto.js';

export class UpdateStockLocationDto extends PartialType(CreateStockLocationDto) {}
