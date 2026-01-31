import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import type {
  Customer,
  Address,
  CustomerGroup,
  Prisma,
} from '../../../generated/prisma/index.js';
import { UpdateCustomerDto } from './dto/update-customer.dto.js';
import { CreateAddressDto } from './dto/create-address.dto.js';
import { UpdateAddressDto } from './dto/update-address.dto.js';
import { CreateCustomerGroupDto } from './dto/create-customer-group.dto.js';
import { UpdateCustomerGroupDto } from './dto/update-customer-group.dto.js';
import { ListCustomersQueryDto } from './dto/list-customers-query.dto.js';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto.js';
import { getPaginationParams } from '../../common/utils/pagination.util.js';

@Injectable()
export class CustomerService {
  constructor(private readonly prisma: PrismaService) {}

  // ----------------------------------------------------------------
  // Customer CRUD
  // ----------------------------------------------------------------

  async findAll(
    query: ListCustomersQueryDto,
  ): Promise<PaginatedResponseDto<Customer>> {
    const { skip, take } = getPaginationParams(query);

    const where: Prisma.CustomerWhereInput = {
      deletedAt: null,
    };

    if (query.customerGroupId) {
      where.customerGroupId = query.customerGroupId;
    }

    if (query.search) {
      where.OR = [
        { phone: { contains: query.search, mode: 'insensitive' } },
        {
          user: {
            OR: [
              {
                email: { contains: query.search, mode: 'insensitive' },
              },
              {
                firstName: { contains: query.search, mode: 'insensitive' },
              },
              {
                lastName: { contains: query.search, mode: 'insensitive' },
              },
            ],
          },
        },
      ];
    }

    const [customers, total] = await Promise.all([
      this.prisma.client.customer.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              role: true,
              isActive: true,
              lastLoginAt: true,
              createdAt: true,
            },
          },
          customerGroup: true,
        },
      }),
      this.prisma.client.customer.count({ where }),
    ]);

    return new PaginatedResponseDto(
      customers as unknown as Customer[],
      total,
      query.page ?? 1,
      query.limit ?? 20,
    );
  }

  async findById(id: string): Promise<Customer> {
    const customer = await this.prisma.client.customer.findFirst({
      where: { id, deletedAt: null },
      include: {
        addresses: true,
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            isActive: true,
            lastLoginAt: true,
            createdAt: true,
          },
        },
        customerGroup: true,
      },
    });

    if (!customer) {
      throw new NotFoundException(`Customer with ID "${id}" not found`);
    }

    return customer as unknown as Customer;
  }

  async findByUserId(userId: string): Promise<Customer> {
    const customer = await this.prisma.client.customer.findFirst({
      where: { userId, deletedAt: null },
      include: {
        addresses: true,
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            isActive: true,
            lastLoginAt: true,
            createdAt: true,
          },
        },
        customerGroup: true,
      },
    });

    if (!customer) {
      throw new NotFoundException(`Customer for user ID "${userId}" not found`);
    }

    return customer as unknown as Customer;
  }

  async update(id: string, dto: UpdateCustomerDto): Promise<Customer> {
    await this.findById(id);

    const data: Prisma.CustomerUpdateInput = {};

    if (dto.phone !== undefined) data.phone = dto.phone;
    if (dto.metadata !== undefined) data.metadata = dto.metadata;
    if (dto.customerGroupId !== undefined) {
      if (dto.customerGroupId) {
        data.customerGroup = { connect: { id: dto.customerGroupId } };
      } else {
        data.customerGroup = { disconnect: true };
      }
    }

    const updated = await this.prisma.client.customer.update({
      where: { id },
      data,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            role: true,
            isActive: true,
            lastLoginAt: true,
            createdAt: true,
          },
        },
        customerGroup: true,
      },
    });

    return updated as unknown as Customer;
  }

  async remove(id: string): Promise<Customer> {
    await this.findById(id);

    const deleted = await this.prisma.client.customer.update({
      where: { id },
      data: { deletedAt: new Date() },
    });

    return deleted;
  }

  // ----------------------------------------------------------------
  // Address CRUD
  // ----------------------------------------------------------------

  async listAddresses(customerId: string): Promise<Address[]> {
    await this.findById(customerId);

    return this.prisma.client.address.findMany({
      where: { customerId },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });
  }

  async addAddress(
    customerId: string,
    dto: CreateAddressDto,
  ): Promise<Address> {
    await this.findById(customerId);

    if (dto.isDefault) {
      await this.clearDefaultAddress(customerId);
    }

    return this.prisma.client.address.create({
      data: {
        customerId,
        label: dto.label,
        firstName: dto.firstName,
        lastName: dto.lastName,
        addressLine1: dto.addressLine1,
        addressLine2: dto.addressLine2,
        city: dto.city,
        state: dto.state,
        postalCode: dto.postalCode,
        countryCode: dto.countryCode,
        phone: dto.phone,
        isDefault: dto.isDefault ?? false,
      },
    });
  }

  async updateAddress(
    addressId: string,
    dto: UpdateAddressDto,
  ): Promise<Address> {
    const address = await this.prisma.client.address.findUnique({
      where: { id: addressId },
    });

    if (!address) {
      throw new NotFoundException(`Address with ID "${addressId}" not found`);
    }

    if (dto.isDefault) {
      await this.clearDefaultAddress(address.customerId);
    }

    return this.prisma.client.address.update({
      where: { id: addressId },
      data: dto,
    });
  }

  async removeAddress(addressId: string): Promise<Address> {
    const address = await this.prisma.client.address.findUnique({
      where: { id: addressId },
    });

    if (!address) {
      throw new NotFoundException(`Address with ID "${addressId}" not found`);
    }

    return this.prisma.client.address.delete({
      where: { id: addressId },
    });
  }

  async setDefaultAddress(
    customerId: string,
    addressId: string,
  ): Promise<Address> {
    await this.findById(customerId);

    const address = await this.prisma.client.address.findFirst({
      where: { id: addressId, customerId },
    });

    if (!address) {
      throw new NotFoundException(
        `Address with ID "${addressId}" not found for this customer`,
      );
    }

    await this.clearDefaultAddress(customerId);

    return this.prisma.client.address.update({
      where: { id: addressId },
      data: { isDefault: true },
    });
  }

  // ----------------------------------------------------------------
  // Customer Groups
  // ----------------------------------------------------------------

  async listGroups(): Promise<CustomerGroup[]> {
    return this.prisma.client.customerGroup.findMany({
      where: { deletedAt: null },
      orderBy: { name: 'asc' },
    });
  }

  async createGroup(dto: CreateCustomerGroupDto): Promise<CustomerGroup> {
    const existing = await this.prisma.client.customerGroup.findUnique({
      where: { name: dto.name },
    });

    if (existing) {
      throw new ConflictException(
        `Customer group with name "${dto.name}" already exists`,
      );
    }

    return this.prisma.client.customerGroup.create({
      data: {
        name: dto.name,
        description: dto.description,
        metadata: dto.metadata,
      },
    });
  }

  async updateGroup(
    id: string,
    dto: UpdateCustomerGroupDto,
  ): Promise<CustomerGroup> {
    const group = await this.prisma.client.customerGroup.findFirst({
      where: { id, deletedAt: null },
    });

    if (!group) {
      throw new NotFoundException(`Customer group with ID "${id}" not found`);
    }

    if (dto.name && dto.name !== group.name) {
      const existing = await this.prisma.client.customerGroup.findFirst({
        where: { name: dto.name, id: { not: id }, deletedAt: null },
      });

      if (existing) {
        throw new ConflictException(
          `Customer group with name "${dto.name}" already exists`,
        );
      }
    }

    return this.prisma.client.customerGroup.update({
      where: { id },
      data: dto,
    });
  }

  async removeGroup(id: string): Promise<CustomerGroup> {
    const group = await this.prisma.client.customerGroup.findFirst({
      where: { id, deletedAt: null },
    });

    if (!group) {
      throw new NotFoundException(`Customer group with ID "${id}" not found`);
    }

    return this.prisma.client.customerGroup.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  // ----------------------------------------------------------------
  // Helpers
  // ----------------------------------------------------------------

  private async clearDefaultAddress(customerId: string): Promise<void> {
    await this.prisma.client.address.updateMany({
      where: { customerId, isDefault: true },
      data: { isDefault: false },
    });
  }
}
