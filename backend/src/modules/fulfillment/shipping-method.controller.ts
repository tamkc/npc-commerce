import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ShippingMethodService } from './shipping-method.service';
import { CreateShippingMethodDto } from './dto/create-shipping-method.dto';
import { UpdateShippingMethodDto } from './dto/update-shipping-method.dto';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Shipping Methods')
@Controller('admin/shipping-methods')
@Roles('ADMIN')
@ApiBearerAuth()
export class ShippingMethodController {
  constructor(private shippingMethodService: ShippingMethodService) {}

  @Get()
  @ApiOperation({ summary: 'List shipping methods' })
  findAll(@Query() query: PaginationQueryDto) {
    return this.shippingMethodService.findAll(query);
  }

  @Get('region/:regionId')
  @ApiOperation({ summary: 'List shipping methods by region' })
  findByRegion(@Param('regionId') regionId: string) {
    return this.shippingMethodService.findByRegion(regionId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get shipping method by ID' })
  findById(@Param('id') id: string) {
    return this.shippingMethodService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create shipping method' })
  create(@Body() dto: CreateShippingMethodDto) {
    return this.shippingMethodService.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update shipping method' })
  update(@Param('id') id: string, @Body() dto: UpdateShippingMethodDto) {
    return this.shippingMethodService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete shipping method' })
  remove(@Param('id') id: string) {
    return this.shippingMethodService.remove(id);
  }
}
