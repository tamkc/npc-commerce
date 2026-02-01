import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Param,
  Body,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RegionService } from './region.service';
import { CreateRegionDto } from './dto/create-region.dto';
import { UpdateRegionDto } from './dto/update-region.dto';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('Regions')
@Controller()
export class RegionController {
  constructor(private regionService: RegionService) {}

  @Public()
  @Get('regions')
  @ApiOperation({ summary: 'List regions' })
  findAll() {
    return this.regionService.findAll();
  }

  @Public()
  @Get('regions/:id')
  @ApiOperation({ summary: 'Get region detail' })
  findById(@Param('id') id: string) {
    return this.regionService.findById(id);
  }

  @Roles('ADMIN')
  @Post('admin/regions')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create region' })
  create(@Body() dto: CreateRegionDto) {
    return this.regionService.create(dto);
  }

  @Roles('ADMIN')
  @Patch('admin/regions/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update region' })
  update(@Param('id') id: string, @Body() dto: UpdateRegionDto) {
    return this.regionService.update(id, dto);
  }

  @Roles('ADMIN')
  @Delete('admin/regions/:id')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete region' })
  remove(@Param('id') id: string) {
    return this.regionService.remove(id);
  }

  @Roles('ADMIN')
  @Post('admin/regions/:id/countries')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Add countries to region' })
  addCountries(
    @Param('id') id: string,
    @Body() body: { countryCodes: string[] },
  ) {
    return this.regionService.addCountries(id, body.countryCodes);
  }

  @Roles('ADMIN')
  @Delete('admin/regions/:id/countries/:code')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remove country from region' })
  removeCountry(@Param('id') id: string, @Param('code') code: string) {
    return this.regionService.removeCountry(id, code);
  }
}
