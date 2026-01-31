import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { CreateCategoryDto } from './dto/create-category.dto.js';
import { UpdateCategoryDto } from './dto/update-category.dto.js';
import { generateSlug } from '../../common/utils/slug.util.js';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.client.category.findMany({
      where: { parentId: null },
      orderBy: { position: 'asc' },
      include: {
        children: {
          orderBy: { position: 'asc' },
          include: {
            children: {
              orderBy: { position: 'asc' },
            },
            _count: {
              select: { products: true },
            },
          },
        },
        _count: {
          select: { products: true },
        },
      },
    });
  }

  async findById(id: string) {
    const category = await this.prisma.client.category.findUnique({
      where: { id },
      include: {
        children: {
          orderBy: { position: 'asc' },
        },
        products: {
          include: {
            product: {
              include: {
                variants: true,
                images: { orderBy: { position: 'asc' } },
              },
            },
          },
        },
        _count: {
          select: { products: true },
        },
      },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID "${id}" not found`);
    }

    return category;
  }

  async findBySlug(slug: string) {
    const category = await this.prisma.client.category.findFirst({
      where: { slug },
      include: {
        children: {
          orderBy: { position: 'asc' },
        },
        products: {
          include: {
            product: {
              include: {
                variants: true,
                images: { orderBy: { position: 'asc' } },
              },
            },
          },
        },
        _count: {
          select: { products: true },
        },
      },
    });

    if (!category) {
      throw new NotFoundException(`Category with slug "${slug}" not found`);
    }

    return category;
  }

  async create(dto: CreateCategoryDto) {
    const slug = generateSlug(dto.name);

    return this.prisma.client.category.create({
      data: {
        name: dto.name,
        slug,
        description: dto.description,
        parentId: dto.parentId,
        position: dto.position ?? 0,
        isActive: dto.isActive ?? true,
      },
      include: {
        children: true,
        _count: {
          select: { products: true },
        },
      },
    });
  }

  async update(id: string, dto: UpdateCategoryDto) {
    await this.findById(id);

    const data: any = { ...dto };

    if (dto.name) {
      data.slug = generateSlug(dto.name);
    }

    return this.prisma.client.category.update({
      where: { id },
      data,
      include: {
        children: true,
        _count: {
          select: { products: true },
        },
      },
    });
  }

  async remove(id: string) {
    await this.findById(id);

    return this.prisma.client.category.delete({
      where: { id },
    });
  }
}
