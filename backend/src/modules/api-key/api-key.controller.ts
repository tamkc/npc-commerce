import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ApiKeyService } from './api-key.service';
import { CreateApiKeyDto } from './dto/create-api-key.dto';
import { Roles } from '../../common/decorators/roles.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';

@ApiTags('API Keys')
@Controller('admin/api-keys')
@Roles('ADMIN')
@ApiBearerAuth()
export class ApiKeyController {
  constructor(private apiKeyService: ApiKeyService) {}

  @Get()
  @ApiOperation({ summary: 'List API keys' })
  findAll() {
    return this.apiKeyService.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Generate new API key (raw key returned once)' })
  generate(@CurrentUser() user: { sub: string }, @Body() dto: CreateApiKeyDto) {
    return this.apiKeyService.generate(user.sub, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Revoke API key' })
  revoke(@Param('id') id: string) {
    return this.apiKeyService.revoke(id);
  }
}
