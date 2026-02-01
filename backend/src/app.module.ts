import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { SpaFallbackMiddleware } from './common/middleware/spa-fallback.middleware';

import appConfig from './config/app.config';
import jwtConfig from './config/jwt.config';
import stripeConfig from './config/stripe.config';
import throttleConfig from './config/throttle.config';
import redisConfig from './config/redis.config';

import { PrismaModule } from './database/prisma.module';
import { AppCacheModule } from './common/cache/cache.module';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { RolesGuard } from './common/guards/roles.guard';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { ConfigService } from '@nestjs/config';

// Phase 1: User Access
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { CustomerModule } from './modules/customer/customer.module';
import { ApiKeyModule } from './modules/api-key/api-key.module';

// Phase 2: Regions & Configuration
import { CurrencyModule } from './modules/currency/currency.module';
import { RegionModule } from './modules/region/region.module';
import { TaxModule } from './modules/tax/tax.module';
import { SalesChannelModule } from './modules/sales-channel/sales-channel.module';

// Phase 3: Merchandising
import { ProductModule } from './modules/product/product.module';
import { PricingModule } from './modules/pricing/pricing.module';
import { PromotionModule } from './modules/promotion/promotion.module';

// Phase 4: Inventory
import { StockLocationModule } from './modules/stock-location/stock-location.module';
import { InventoryModule } from './modules/inventory/inventory.module';

// Phase 5: Cart & Checkout
import { CartModule } from './modules/cart/cart.module';
import { CheckoutModule } from './modules/checkout/checkout.module';
import { PaymentModule } from './modules/payment/payment.module';

// Phase 6: Orders & Fulfillment
import { OrderModule } from './modules/order/order.module';
import { FulfillmentModule } from './modules/fulfillment/fulfillment.module';

// Infrastructure: Queues
import { QueueModule } from './modules/queue/queue.module';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/app',
      exclude: ['/api/v1/{*path}'],
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, jwtConfig, stripeConfig, throttleConfig, redisConfig],
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (config: ConfigService) => [
        {
          ttl: config.get<number>('throttle.ttl') ?? 60000,
          limit: config.get<number>('throttle.limit') ?? 100,
        },
      ],
    }),
    PrismaModule,
    AppCacheModule,

    // User Access
    UserModule,
    AuthModule,
    CustomerModule,
    ApiKeyModule,

    // Regions & Configuration
    CurrencyModule,
    RegionModule,
    TaxModule,
    SalesChannelModule,

    // Merchandising
    ProductModule,
    PricingModule,
    PromotionModule,

    // Inventory
    StockLocationModule,
    InventoryModule,

    // Cart & Checkout
    CartModule,
    CheckoutModule,
    PaymentModule,

    // Orders & Fulfillment
    OrderModule,
    FulfillmentModule,

    // Infrastructure
    QueueModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(SpaFallbackMiddleware).forRoutes('/app/{*path}');
  }
}
