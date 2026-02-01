import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { Public } from '../../common/decorators/public.decorator';
import { CheckoutService } from './checkout.service';
import { CompleteCheckoutDto } from './dto/complete-checkout.dto';

@ApiTags('Store / Checkout')
@ApiBearerAuth()
@Controller('store/checkout')
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Post()
  @Public()
  @ApiOperation({ summary: 'Complete checkout and create an order' })
  async completeCheckout(@Body() dto: CompleteCheckoutDto) {
    return this.checkoutService.completeCheckout(dto);
  }
}
