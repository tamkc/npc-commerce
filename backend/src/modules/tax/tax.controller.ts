import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { TaxService } from './tax.service.js';
import { CreateTaxRateDto } from './dto/create-tax-rate.dto.js';
import { UpdateTaxRateDto } from './dto/update-tax-rate.dto.js';
import { Roles } from '../../common/decorators/roles.decorator.js';

@ApiTags('Tax')
@Controller('admin/tax-rates')
@Roles('ADMIN')
@ApiBearerAuth()
export class TaxController {
  constructor(private taxService: TaxService) {}

  @Get()
  @ApiOperation({ summary: 'List tax rates' })
  findAll(@Query('regionId') regionId?: string) {
    return this.taxService.findAll(regionId);
  }

  @Post()
  @ApiOperation({ summary: 'Create tax rate' })
  create(@Body() dto: CreateTaxRateDto) {
    return this.taxService.create(dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update tax rate' })
  update(@Param('id') id: string, @Body() dto: UpdateTaxRateDto) {
    return this.taxService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete tax rate' })
  remove(@Param('id') id: string) {
    return this.taxService.remove(id);
  }
}
