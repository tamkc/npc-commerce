import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentService } from './payment.service';
import { CreatePaymentIntentDto } from './dto/create-payment-intent.dto';
import { CreateRefundDto } from './dto/create-refund.dto';

@ApiTags('Admin / Payments')
@ApiBearerAuth()
@Controller('admin/payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('intents')
  @ApiOperation({ summary: 'Create a payment intent for an order' })
  async createPaymentIntent(@Body() dto: CreatePaymentIntentDto) {
    return this.paymentService.createPaymentIntent(dto);
  }

  @Get('order/:orderId')
  @ApiOperation({ summary: 'Get payments for an order' })
  async findByOrder(@Param('orderId') orderId: string) {
    return this.paymentService.findByOrder(orderId);
  }

  @Post('refunds')
  @ApiOperation({ summary: 'Create a refund for a payment' })
  async createRefund(@Body() dto: CreateRefundDto) {
    return this.paymentService.createRefund(dto);
  }
}
