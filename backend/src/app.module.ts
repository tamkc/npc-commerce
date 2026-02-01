import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { SpaFallbackMiddleware } from './common/middleware/spa-fallback.middleware.js';

import appConfig from './config/app.config.js';
import jwtConfig from './config/jwt.config.js';
import stripeConfig from './config/stripe.config.js';
import throttleConfig from './config/throttle.config.js';
import redisConfig from './config/redis.config.js';

import { PrismaModule } from './database/prisma.module.js';
import { AppCacheModule } from './common/cache/cache.module.js';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard.js';
import { RolesGuard } from './common/guards/roles.guard.js';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { ConfigService } from '@nestjs/config';

// Phase 1: User Access
import { UserModule } from './modules/user/user.module.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { CustomerModule } from './modules/customer/customer.module.js';
import { ApiKeyModule } from './modules/api-key/api-key.module.js';

// Phase 2: Regions & Configuration
import { CurrencyModule } from './modules/currency/currency.module.js';
import { RegionModule } from './modules/region/region.module.js';
import { TaxModule } from './modules/tax/tax.module.js';
import { SalesChannelModule } from './modules/sales-channel/sales-channel.module.js';

// Phase 3: Merchandising
import { ProductModule } from './modules/product/product.module.js';
import { PricingModule } from './modules/pricing/pricing.module.js';
import { PromotionModule } from './modules/promotion/promotion.module.js';

// Phase 4: Inventory
import { StockLocationModule } from './modules/stock-location/stock-location.module.js';
import { InventoryModule } from './modules/inventory/inventory.module.js';

// Phase 5: Cart & Checkout
import { CartModule } from './modules/cart/cart.module.js';
import { CheckoutModule } from './modules/checkout/checkout.module.js';
import { PaymentModule } from './modules/payment/payment.module.js';

// Phase 6: Orders & Fulfillment
import { OrderModule } from './modules/order/order.module.js';
import { FulfillmentModule } from './modules/fulfillment/fulfillment.module.js';

// Infrastructure: Queues
import { QueueModule } from './modules/queue/queue.module.js';

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
