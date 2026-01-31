import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service.js';
import { CreateProductDto } from './dto/create-product.dto.js';
import { UpdateProductDto } from './dto/update-product.dto.js';
import { ProductQueryDto } from './dto/product-query.dto.js';
import { PaginatedResult } from '../../common/dto/pagination-query.dto.js';
import { generateSlug } from '../../common/utils/slug.util.js';
import { CacheService } from '../../common/cache/cache.service.js';
import { CacheKeys, CacheTTL } from '../../common/cache/cache-keys.js';

@Injectable()
export class ProductService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly cache: CacheService,
  ) {}

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

    const cacheKey = `${CacheKeys.PRODUCT_LIST}:${JSON.stringify({ page, limit, status, categoryId, salesChannelId, search, tag })}`;
    const cached = await this.cache.get<PaginatedResult<any>>(cacheKey);
    if (cached) return cached;

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

    const result = {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };

    await this.cache.set(cacheKey, result, CacheTTL.PRODUCT);
    return result;
  }

  async findById(id: string) {
    const cacheKey = `${CacheKeys.PRODUCT_DETAIL}:${id}`;
    const cached = await this.cache.get<any>(cacheKey);
    if (cached) return cached;

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

    await this.cache.set(cacheKey, product, CacheTTL.PRODUCT);
    return product;
  }

  async findBySlug(slug: string) {
    const cacheKey = `${CacheKeys.PRODUCT_SLUG}:${slug}`;
    const cached = await this.cache.get<any>(cacheKey);
    if (cached) return cached;

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

    await this.cache.set(cacheKey, product, CacheTTL.PRODUCT);
    return product;
  }

  async create(dto: CreateProductDto) {
    const handle = dto.handle || generateSlug(dto.title);

    const product = await this.prisma.client.product.create({
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

    await this.invalidateProductCache();
    return product;
  }

  async update(id: string, dto: UpdateProductDto) {
    await this.findById(id);

    const data: any = { ...dto };

    if (dto.title) {
      data.handle = dto.handle || generateSlug(dto.title);
    }

    const product = await this.prisma.client.product.update({
      where: { id },
      data,
      include: {
        variants: true,
        images: true,
        categories: { include: { category: true } },
        tags: { include: { tag: true } },
      },
    });

    await this.invalidateProductCache();
    return product;
  }

  async remove(id: string) {
    await this.findById(id);

    const result = await this.prisma.client.product.delete({
      where: { id },
    });

    await this.invalidateProductCache();
    return result;
  }

  async addTag(productId: string, tagName: string) {
    await this.findById(productId);

    const tag = await this.prisma.client.tag.upsert({
      where: { name: tagName },
      update: {},
      create: { name: tagName },
    });

    const result = await this.prisma.client.productTag.create({
      data: {
        productId,
        tagId: tag.id,
      },
      include: { tag: true },
    });

    await this.invalidateProductCache();
    return result;
  }

  async removeTag(productId: string, tagId: string) {
    await this.findById(productId);

    const result = await this.prisma.client.productTag.delete({
      where: {
        productId_tagId: {
          productId,
          tagId,
        },
      },
    });

    await this.invalidateProductCache();
    return result;
  }

  async addToCategory(productId: string, categoryId: string) {
    await this.findById(productId);

    const result = await this.prisma.client.productCategory.create({
      data: {
        productId,
        categoryId,
      },
      include: { category: true },
    });

    await this.invalidateProductCache();
    return result;
  }

  async removeFromCategory(productId: string, categoryId: string) {
    await this.findById(productId);

    const result = await this.prisma.client.productCategory.delete({
      where: {
        productId_categoryId: {
          productId,
          categoryId,
        },
      },
    });

    await this.invalidateProductCache();
    return result;
  }

  private async invalidateProductCache(): Promise<void> {
    await this.cache.delByPrefix('product:');
  }
}
