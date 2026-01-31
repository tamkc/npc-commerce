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
import { PromotionService } from './promotion.service.js';
import { PromotionEngineService } from './promotion-engine.service.js';
import { CreatePromotionDto } from './dto/create-promotion.dto.js';
import { UpdatePromotionDto } from './dto/update-promotion.dto.js';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto.js';
import { Roles } from '../../common/decorators/roles.decorator.js';

@ApiTags('Promotions')
@Controller('admin/promotions')
@Roles('ADMIN')
@ApiBearerAuth()
export class PromotionController {
  constructor(
    private promotionService: PromotionService,
    private promotionEngine: PromotionEngineService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List promotions' })
  findAll(@Query() query: PaginationQueryDto) {
    return this.promotionService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get promotion by ID' })
  findById(@Param('id') id: string) {
    return this.promotionService.findById(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create promotion' })
  create(@Body() dto: CreatePromotionDto) {
    return this.promotionService.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update promotion' })
  update(@Param('id') id: string, @Body() dto: UpdatePromotionDto) {
    return this.promotionService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete promotion' })
  remove(@Param('id') id: string) {
    return this.promotionService.remove(id);
  }

  @Post('validate')
  @ApiOperation({ summary: 'Validate a discount code' })
  validate(
    @Body() body: { code: string; orderAmount: number; customerId?: string },
  ) {
    return this.promotionEngine.validateCode(
      body.code,
      body.orderAmount,
      body.customerId,
    );
  }
}
