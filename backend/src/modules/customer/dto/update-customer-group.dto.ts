import { PartialType } from '@nestjs/swagger';
import { CreateCustomerGroupDto } from './create-customer-group.dto.js';

export class UpdateCustomerGroupDto extends PartialType(
  CreateCustomerGroupDto,
) {}
