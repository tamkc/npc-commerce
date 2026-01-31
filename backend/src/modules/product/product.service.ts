import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { ProductQueryDto } from './dto/product-query.dto.js';
import { PaginatedResult } from '../../common/dto/pagination-query.dto.js';
import { generateSlug } from '../../common/utils/slug.util.js';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: ProductQueryDto): Promise<PaginatedResult<any>> {
    const {
      page = 1,
      limit = 20,
      status,
      categoryId,
      salesChannelId,
      search,
      tag,
    } = query;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (search) {
      where.title = { contains: search, mode: 'insensitive' };
    }

    if (categoryId) {
      where.categories = {
        some: { categoryId },
      };
    }

    if (salesChannelId) {
      where.salesChannels = {
        some: { salesChannelId },
      };
    }

    if (tag) {
      where.tags = {
        some: {
          tag: { name: tag },
        },
      };
    }

    const [data, total] = await Promise.all([
      this.prisma.client.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          variants: true,
          images: { orderBy: { position: 'asc' } },
          categories: {
            include: { category: true },
          },
          tags: {
            include: { tag: true },
          },
        },
      }),
      this.prisma.client.product.count({ where }),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findById(id: string) {
    const product = await this.prisma.client.product.findUnique({
      where: { id },
      include: {
        variants: {
          include: { optionValues: true },
        },
        images: { orderBy: { position: 'asc' } },
        categories: {
          include: { category: true },
        },
        tags: {
          include: { tag: true },
        },
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with ID "${id}" not found`);
    }

    return product;
  }

  async findBySlug(slug: string) {
    const product = await this.prisma.client.product.findFirst({
      where: { OR: [{ slug }, { handle: slug }] },
      include: {
        variants: {
          include: { optionValues: true },
        },
        images: { orderBy: { position: 'asc' } },
        categories: {
          include: { category: true },
        },
        tags: {
          include: { tag: true },
        },
      },
    });

    if (!product) {
      throw new NotFoundException(`Product with slug "${slug}" not found`);
    }

    return product;
  }

  async create(dto: CreateProductDto) {
    const handle = dto.handle || generateSlug(dto.title);

    return this.prisma.client.product.create({
      data: {
        title: dto.title,
        slug: handle,
        description: dto.description,
        handle,
        status: dto.status || 'DRAFT',
        isGiftCard: dto.isGiftCard ?? false,
        metadata: (dto.metadata ?? {}) as any,
      },
      include: {
        variants: true,
        images: true,
        categories: { include: { category: true } },
        tags: { include: { tag: true } },
      },
    });
  }

  async update(id: string, dto: UpdateProductDto) {
    await this.findById(id);

    const data: any = { ...dto };

    if (dto.title) {
      data.handle = dto.handle || generateSlug(dto.title);
    }

    return this.prisma.client.product.update({
      where: { id },
      data,
      include: {
        variants: true,
        images: true,
        categories: { include: { category: true } },
        tags: { include: { tag: true } },
      },
    });
  }

  async remove(id: string) {
    await this.findById(id);

    return this.prisma.client.product.delete({
      where: { id },
    });
  }

  async addTag(productId: string, tagName: string) {
    await this.findById(productId);

    const tag = await this.prisma.client.tag.upsert({
      where: { name: tagName },
      update: {},
      create: { name: tagName },
    });

    return this.prisma.client.productTag.create({
      data: {
        productId,
        tagId: tag.id,
      },
      include: { tag: true },
    });
  }

  async removeTag(productId: string, tagId: string) {
    await this.findById(productId);

    return this.prisma.client.productTag.delete({
      where: {
        productId_tagId: {
          productId,
          tagId,
        },
      },
    });
  }

  async addToCategory(productId: string, categoryId: string) {
    await this.findById(productId);

    return this.prisma.client.productCategory.create({
      data: {
        productId,
        categoryId,
      },
      include: { category: true },
    });
  }

  async removeFromCategory(productId: string, categoryId: string) {
    await this.findById(productId);

    return this.prisma.client.productCategory.delete({
      where: {
        productId_categoryId: {
          productId,
          categoryId,
        },
      },
    });
  }
}
