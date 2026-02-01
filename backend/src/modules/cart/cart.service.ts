import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { Prisma } from '../../../generated/prisma/client';
import { PrismaService } from '../../database/prisma.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateCartDto) {
    return this.prisma.client.cart.create({
      data: {
        customerId: dto.customerId,
        regionId: dto.regionId,
        salesChannelId: dto.salesChannelId,
        email: dto.email,
        currencyCode: dto.currencyCode ?? 'USD',
        subtotal: new Prisma.Decimal(0),
        taxTotal: new Prisma.Decimal(0),
        shippingTotal: new Prisma.Decimal(0),
        discountTotal: new Prisma.Decimal(0),
        total: new Prisma.Decimal(0),
      },
      include: {
        items: {
          include: {
            variant: true,
          },
        },
      },
    });
  }

  async findById(id: string) {
    const cart = await this.prisma.client.cart.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            variant: true,
          },
        },
      },
    });

    if (!cart) {
      throw new NotFoundException(`Cart with ID ${id} not found`);
    }

    return cart;
  }

  async findByCustomer(customerId: string) {
    const cart = await this.prisma.client.cart.findFirst({
      where: {
        customerId,
        completedAt: null,
      },
      include: {
        items: {
          include: {
            variant: true,
          },
        },
      },
    });

    return cart;
  }

  async addItem(cartId: string, dto: AddCartItemDto) {
    const cart = await this.prisma.client.cart.findUnique({
      where: { id: cartId },
    });

    if (!cart) {
      throw new NotFoundException(`Cart with ID ${cartId} not found`);
    }

    if (cart.completedAt) {
      throw new BadRequestException('Cannot modify a completed cart');
    }

    const variant = await this.prisma.client.productVariant.findUnique({
      where: { id: dto.variantId },
    });

    if (!variant) {
      throw new NotFoundException(
        `Product variant with ID ${dto.variantId} not found`,
      );
    }

    const unitPrice = variant.price;

    const existingItem = await this.prisma.client.cartItem.findFirst({
      where: {
        cartId,
        variantId: dto.variantId,
      },
    });

    if (existingItem) {
      const newQuantity = existingItem.quantity + dto.quantity;
      const newTotal = unitPrice.mul(newQuantity);

      await this.prisma.client.cartItem.update({
        where: { id: existingItem.id },
        data: {
          quantity: newQuantity,
          unitPrice,
          total: newTotal,
        },
      });
    } else {
      const itemTotal = unitPrice.mul(dto.quantity);

      await this.prisma.client.cartItem.create({
        data: {
          cartId,
          variantId: dto.variantId,
          quantity: dto.quantity,
          unitPrice,
          total: itemTotal,
        },
      });
    }

    await this.recalculateTotals(cartId);

    return this.findById(cartId);
  }

  async updateItem(cartId: string, itemId: string, dto: UpdateCartItemDto) {
    const cart = await this.prisma.client.cart.findUnique({
      where: { id: cartId },
    });

    if (!cart) {
      throw new NotFoundException(`Cart with ID ${cartId} not found`);
    }

    if (cart.completedAt) {
      throw new BadRequestException('Cannot modify a completed cart');
    }

    const item = await this.prisma.client.cartItem.findFirst({
      where: { id: itemId, cartId },
    });

    if (!item) {
      throw new NotFoundException(
        `Cart item with ID ${itemId} not found in cart ${cartId}`,
      );
    }

    if (dto.quantity === 0) {
      await this.prisma.client.cartItem.delete({
        where: { id: itemId },
      });
    } else {
      const newTotal = item.unitPrice.mul(dto.quantity);

      await this.prisma.client.cartItem.update({
        where: { id: itemId },
        data: {
          quantity: dto.quantity,
          total: newTotal,
        },
      });
    }

    await this.recalculateTotals(cartId);

    return this.findById(cartId);
  }

  async removeItem(cartId: string, itemId: string) {
    const cart = await this.prisma.client.cart.findUnique({
      where: { id: cartId },
    });

    if (!cart) {
      throw new NotFoundException(`Cart with ID ${cartId} not found`);
    }

    if (cart.completedAt) {
      throw new BadRequestException('Cannot modify a completed cart');
    }

    const item = await this.prisma.client.cartItem.findFirst({
      where: { id: itemId, cartId },
    });

    if (!item) {
      throw new NotFoundException(
        `Cart item with ID ${itemId} not found in cart ${cartId}`,
      );
    }

    await this.prisma.client.cartItem.delete({
      where: { id: itemId },
    });

    await this.recalculateTotals(cartId);

    return this.findById(cartId);
  }

  async applyDiscount(cartId: string, code: string) {
    const cart = await this.prisma.client.cart.findUnique({
      where: { id: cartId },
    });

    if (!cart) {
      throw new NotFoundException(`Cart with ID ${cartId} not found`);
    }

    if (cart.completedAt) {
      throw new BadRequestException('Cannot modify a completed cart');
    }

    await this.prisma.client.cart.update({
      where: { id: cartId },
      data: { discountCode: code },
    });

    return this.findById(cartId);
  }

  async removeDiscount(cartId: string) {
    const cart = await this.prisma.client.cart.findUnique({
      where: { id: cartId },
    });

    if (!cart) {
      throw new NotFoundException(`Cart with ID ${cartId} not found`);
    }

    if (cart.completedAt) {
      throw new BadRequestException('Cannot modify a completed cart');
    }

    await this.prisma.client.cart.update({
      where: { id: cartId },
      data: { discountCode: null },
    });

    return this.findById(cartId);
  }

  async markCompleted(cartId: string) {
    const cart = await this.prisma.client.cart.findUnique({
      where: { id: cartId },
    });

    if (!cart) {
      throw new NotFoundException(`Cart with ID ${cartId} not found`);
    }

    return this.prisma.client.cart.update({
      where: { id: cartId },
      data: { completedAt: new Date() },
    });
  }

  private async recalculateTotals(cartId: string) {
    const items = await this.prisma.client.cartItem.findMany({
      where: { cartId },
    });

    let subtotal = new Prisma.Decimal(0);
    for (const item of items) {
      subtotal = subtotal.add(item.total);
    }

    await this.prisma.client.cart.update({
      where: { id: cartId },
      data: {
        subtotal,
        total: subtotal,
      },
    });
  }
}
