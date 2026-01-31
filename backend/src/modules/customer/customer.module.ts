import { Module } from '@nestjs/common';
import { PrismaModule } from '../../database/prisma.module.js';
import { CustomerService } from './customer.service.js';
import {
  AdminCustomerController,
  AdminCustomerGroupController,
  CustomerAddressController,
} from './customer.controller.js';

@Module({
  imports: [PrismaModule],
  controllers: [
    AdminCustomerController,
    AdminCustomerGroupController,
    CustomerAddressController,
  ],
  providers: [CustomerService],
  exports: [CustomerService],
})
export class CustomerModule {}
