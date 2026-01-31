import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  ParseUUIDPipe,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiParam,
} from '@nestjs/swagger';
import { CustomerService } from './customer.service.js';
import { UpdateCustomerDto } from './dto/update-customer.dto.js';
import { CreateAddressDto } from './dto/create-address.dto.js';
import { UpdateAddressDto } from './dto/update-address.dto.js';
import { CreateCustomerGroupDto } from './dto/create-customer-group.dto.js';
import { UpdateCustomerGroupDto } from './dto/update-customer-group.dto.js';
import { ListCustomersQueryDto } from './dto/list-customers-query.dto.js';
import { Roles } from '../../common/decorators/roles.decorator.js';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import type { JwtPayload } from '../../common/decorators/current-user.decorator.js';
import { RolesGuard } from '../../common/guards/roles.guard.js';
import { UserRole } from '../../../generated/prisma/index.js';

// ================================================================
// Admin endpoints
// ================================================================

@ApiTags('Admin Customers')
@ApiBearerAuth()
@Controller('admin/customers')
@UseGuards(RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminCustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Get()
  @ApiOperation({ summary: 'List all customers (paginated)' })
  findAll(@Query() query: ListCustomersQueryDto) {
    return this.customerService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a customer by ID' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.customerService.findById(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a customer' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCustomerDto,
  ) {
    return this.customerService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Soft delete a customer' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.customerService.remove(id);
  }
}

// ================================================================
// Admin Customer Groups endpoints
// ================================================================

@ApiTags('Admin Customer Groups')
@ApiBearerAuth()
@Controller('admin/customer-groups')
@UseGuards(RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminCustomerGroupController {
  constructor(private readonly customerService: CustomerService) {}

  @Get()
  @ApiOperation({ summary: 'List all customer groups' })
  listGroups() {
    return this.customerService.listGroups();
  }

  @Post()
  @ApiOperation({ summary: 'Create a customer group' })
  createGroup(@Body() dto: CreateCustomerGroupDto) {
    return this.customerService.createGroup(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a customer group' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  updateGroup(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCustomerGroupDto,
  ) {
    return this.customerService.updateGroup(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a customer group' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  removeGroup(@Param('id', ParseUUIDPipe) id: string) {
    return this.customerService.removeGroup(id);
  }
}

// ================================================================
// Customer (Bearer) endpoints
// ================================================================

@ApiTags('Customer Addresses')
@ApiBearerAuth()
@Controller('customers/me/addresses')
@UseGuards(RolesGuard)
@Roles(UserRole.CUSTOMER)
export class CustomerAddressController {
  constructor(private readonly customerService: CustomerService) {}

  @Get()
  @ApiOperation({ summary: 'List my addresses' })
  async listAddresses(@CurrentUser() user: JwtPayload) {
    const customer = await this.customerService.findByUserId(user.sub);
    return this.customerService.listAddresses(customer.id);
  }

  @Post()
  @ApiOperation({ summary: 'Add a new address' })
  async addAddress(
    @CurrentUser() user: JwtPayload,
    @Body() dto: CreateAddressDto,
  ) {
    const customer = await this.customerService.findByUserId(user.sub);
    return this.customerService.addAddress(customer.id, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an address' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async updateAddress(
    @CurrentUser() user: JwtPayload,
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateAddressDto,
  ) {
    // Verify ownership: look up customer, then confirm address belongs to them
    const customer = await this.customerService.findByUserId(user.sub);
    await this.verifyAddressOwnership(customer.id, id);
    return this.customerService.updateAddress(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an address' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  async removeAddress(
    @CurrentUser() user: JwtPayload,
    @Param('id', ParseUUIDPipe) id: string,
  ) {
    const customer = await this.customerService.findByUserId(user.sub);
    await this.verifyAddressOwnership(customer.id, id);
    return this.customerService.removeAddress(id);
  }

  /**
   * Ensures the address belongs to the given customer.
   */
  private async verifyAddressOwnership(
    customerId: string,
    addressId: string,
  ): Promise<void> {
    const addresses =
      await this.customerService.listAddresses(customerId);
    const owned = addresses.some((a) => a.id === addressId);
    if (!owned) {
      throw new NotFoundException(
        `Address with ID "${addressId}" not found for this customer`,
      );
    }
  }
}
