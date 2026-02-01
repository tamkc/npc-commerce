import { Module } from '@nestjs/common';
import { PrismaModule } from '../../database/prisma.module';
import { CustomerService } from './customer.service';
import {
  AdminCustomerController,
  AdminCustomerGroupController,
  CustomerAddressController,
} from './customer.controller';

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
