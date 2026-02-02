import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import type { User, Prisma } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ListUsersQueryDto } from './dto/list-users-query.dto';
import { PaginatedResponseDto } from '../../common/dto/paginated-response.dto';
import { getPaginationParams } from '../../common/utils/pagination.util';
import { hashPassword } from '../../common/utils/hash.util';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: ListUsersQueryDto): Promise<PaginatedResponseDto<User>> {
    const { skip, take } = getPaginationParams(query);

    const where: Prisma.UserWhereInput = {
      deletedAt: null,
    };

    if (query.role) {
      where.role = query.role;
    }

    if (query.isActive !== undefined) {
      where.isActive = query.isActive;
    }

    const [users, total] = await this.prisma.client.$transaction([
      this.prisma.client.user.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          role: true,
          isActive: true,
          lastLoginAt: true,
          createdAt: true,
          updatedAt: true,
          deletedAt: true,
          passwordHash: false,
        },
      }),
      this.prisma.client.user.count({ where }),
    ]);

    return new PaginatedResponseDto(
      users as unknown as User[],
      total,
      query.page ?? 1,
      query.limit ?? 20,
    );
  }

  async findById(id: string): Promise<User> {
    const user = await this.prisma.client.user.findFirst({
      where: { id, deletedAt: null },
    });

    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }

    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.client.user.findFirst({
      where: { email, deletedAt: null },
    });
  }

  async create(dto: CreateUserDto): Promise<User> {
    const existing = await this.prisma.client.user.findUnique({
      where: { email: dto.email },
    });

    if (existing) {
      throw new ConflictException(
        `User with email "${dto.email}" already exists`,
      );
    }

    const passwordHash = await hashPassword(dto.password);

    return this.prisma.client.user.create({
      data: {
        email: dto.email,
        passwordHash,
        firstName: dto.firstName,
        lastName: dto.lastName,
        role: dto.role,
      },
    });
  }

  async update(id: string, dto: UpdateUserDto): Promise<User> {
    await this.findById(id);

    const data: Prisma.UserUpdateInput = {};

    if (dto.email !== undefined) {
      const existing = await this.prisma.client.user.findFirst({
        where: { email: dto.email, id: { not: id } },
      });
      if (existing) {
        throw new ConflictException(
          `User with email "${dto.email}" already exists`,
        );
      }
      data.email = dto.email;
    }

    if (dto.password !== undefined) {
      data.passwordHash = await hashPassword(dto.password);
    }

    if (dto.firstName !== undefined) data.firstName = dto.firstName;
    if (dto.lastName !== undefined) data.lastName = dto.lastName;
    if (dto.role !== undefined) data.role = dto.role;
    if (dto.isActive !== undefined) data.isActive = dto.isActive;

    return this.prisma.client.user.update({
      where: { id },
      data,
    });
  }

  async remove(id: string): Promise<User> {
    await this.findById(id);

    return this.prisma.client.user.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}
