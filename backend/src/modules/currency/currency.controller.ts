import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
  Put,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { CurrencyService } from './currency.service.js';
import { CreateCurrencyDto } from './dto/create-currency.dto.js';
import { UpdateCurrencyDto } from './dto/update-currency.dto.js';
import { UpsertExchangeRateDto } from './dto/upsert-exchange-rate.dto.js';
import { Public } from '../../common/decorators/public.decorator.js';
import { Roles } from '../../common/decorators/roles.decorator.js';

@ApiTags('Currencies')
@Controller()
export class CurrencyController {
  constructor(private currencyService: CurrencyService) {}

  @Public()
  @Get('currencies')
  @ApiOperation({ summary: 'List all currencies' })
  findAll() {
    return this.currencyService.findAll();
  }

  @Public()
  @Get('currencies/:code')
  @ApiOperation({ summary: 'Get currency by code' })
  findByCode(@Param('code') code: string) {
    return this.currencyService.findByCode(code);
  }

  @Roles('ADMIN')
  @Post('admin/currencies')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create currency' })
  create(@Body() dto: CreateCurrencyDto) {
    return this.currencyService.create(dto);
  }

  @Roles('ADMIN')
  @Patch('admin/currencies/:code')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update currency' })
  update(@Param('code') code: string, @Body() dto: UpdateCurrencyDto) {
    return this.currencyService.update(code, dto);
  }

  @Roles('ADMIN')
  @Delete('admin/currencies/:code')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete currency' })
  remove(@Param('code') code: string) {
    return this.currencyService.remove(code);
  }

  @Roles('ADMIN')
  @Get('admin/exchange-rates')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'List exchange rates' })
  listRates() {
    return this.currencyService.listExchangeRates();
  }

  @Roles('ADMIN')
  @Put('admin/exchange-rates')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Upsert exchange rate' })
  upsertRate(@Body() dto: UpsertExchangeRateDto) {
    return this.currencyService.upsertExchangeRate(dto);
  }
}
