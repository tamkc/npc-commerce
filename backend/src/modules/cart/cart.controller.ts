import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator.js';
import { CartService } from './cart.service.js';
import { CreateCartDto } from './dto/create-cart.dto.js';
import { AddCartItemDto } from './dto/add-cart-item.dto.js';
import { UpdateCartItemDto } from './dto/update-cart-item.dto.js';
import { ApplyDiscountDto } from './dto/apply-discount.dto.js';

@ApiTags('Store / Cart')
@ApiBearerAuth()
@Controller('store/cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  @Public()
  @ApiOperation({ summary: 'Create a new cart' })
  async create(@Body() dto: CreateCartDto) {
    return this.cartService.create(dto);
  }

  @Get(':id')
  @Public()
  @ApiOperation({ summary: 'Get a cart by ID' })
  async findById(@Param('id') id: string) {
    return this.cartService.findById(id);
  }

  @Post(':id/items')
  @Public()
  @ApiOperation({ summary: 'Add an item to the cart' })
  async addItem(@Param('id') id: string, @Body() dto: AddCartItemDto) {
    return this.cartService.addItem(id, dto);
  }

  @Put(':id/items/:itemId')
  @Public()
  @ApiOperation({ summary: 'Update a cart item quantity' })
  async updateItem(
    @Param('id') id: string,
    @Param('itemId') itemId: string,
    @Body() dto: UpdateCartItemDto,
  ) {
    return this.cartService.updateItem(id, itemId, dto);
  }

  @Delete(':id/items/:itemId')
  @Public()
  @ApiOperation({ summary: 'Remove an item from the cart' })
  async removeItem(@Param('id') id: string, @Param('itemId') itemId: string) {
    return this.cartService.removeItem(id, itemId);
  }

  @Post(':id/discount')
  @Public()
  @ApiOperation({ summary: 'Apply a discount code to the cart' })
  async applyDiscount(@Param('id') id: string, @Body() dto: ApplyDiscountDto) {
    return this.cartService.applyDiscount(id, dto.code);
  }

  @Delete(':id/discount')
  @Public()
  @ApiOperation({ summary: 'Remove discount code from the cart' })
  async removeDiscount(@Param('id') id: string) {
    return this.cartService.removeDiscount(id);
  }
}
