import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { PricingService } from './pricing.service';
import { PriceCalculatorService } from './price-calculator.service';
import { CreatePriceListDto } from './dto/create-price-list.dto';
import { UpdatePriceListDto } from './dto/update-price-list.dto';
import { SetPriceDto } from './dto/set-price.dto';

@ApiTags('Pricing')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
@Controller('admin/pricing')
export class PricingController {
  constructor(
    private readonly pricingService: PricingService,
    private readonly priceCalculatorService: PriceCalculatorService,
  ) {}

  @Get('price-lists')
  @ApiOperation({ summary: 'List all price lists (paginated)' })
  async findAll(@Query() query: PaginationQueryDto) {
    return this.pricingService.findAll(query);
  }

  @Get('price-lists/:id')
  @ApiOperation({ summary: 'Get a price list by ID' })
  async findById(@Param('id') id: string) {
    return this.pricingService.findById(id);
  }

  @Post('price-lists')
  @ApiOperation({ summary: 'Create a new price list' })
  async create(@Body() dto: CreatePriceListDto) {
    return this.pricingService.create(dto);
  }

  @Put('price-lists/:id')
  @ApiOperation({ summary: 'Update a price list' })
  async update(@Param('id') id: string, @Body() dto: UpdatePriceListDto) {
    return this.pricingService.update(id, dto);
  }

  @Delete('price-lists/:id')
  @ApiOperation({ summary: 'Soft delete a price list' })
  async remove(@Param('id') id: string) {
    return this.pricingService.remove(id);
  }

  @Post('price-lists/prices')
  @ApiOperation({ summary: 'Set (upsert) a price in a price list' })
  async setPrice(@Body() dto: SetPriceDto) {
    return this.pricingService.setPrice(dto);
  }

  @Delete('price-lists/prices/:priceId')
  @ApiOperation({ summary: 'Remove a price entry from a price list' })
  async removePrice(@Param('priceId') priceId: string) {
    return this.pricingService.removePrice(priceId);
  }

  @Post('price-lists/:id/customer-groups')
  @ApiOperation({ summary: 'Link a customer group to a price list' })
  async linkCustomerGroup(
    @Param('id') id: string,
    @Body() body: { customerGroupId: string },
  ) {
    return this.pricingService.linkCustomerGroup(id, body.customerGroupId);
  }

  @Delete('price-lists/:id/customer-groups/:groupId')
  @ApiOperation({ summary: 'Unlink a customer group from a price list' })
  async unlinkCustomerGroup(
    @Param('id') id: string,
    @Param('groupId') groupId: string,
  ) {
    return this.pricingService.unlinkCustomerGroup(id, groupId);
  }

  @Post('calculate-price')
  @ApiOperation({ summary: 'Calculate the best price for a variant' })
  async calculatePrice(
    @Body()
    body: {
      variantId: string;
      quantity: number;
      currencyCode: string;
      customerGroupId?: string;
    },
  ) {
    return this.priceCalculatorService.calculatePrice(
      body.variantId,
      body.quantity,
      body.currencyCode,
      body.customerGroupId,
    );
  }
}
