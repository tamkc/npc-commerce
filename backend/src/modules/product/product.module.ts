import { Module } from '@nestjs/common';
import { ProductService } from './product.service.js';
import { VariantService } from './variant.service.js';
import { CategoryService } from './category.service.js';
import { ProductController } from './product.controller.js';
import { VariantController } from './variant.controller.js';
import { CategoryController } from './category.controller.js';
import { StoreProductController } from './store-product.controller.js';

@Module({
  controllers: [
    ProductController,
    VariantController,
    CategoryController,
    StoreProductController,
  ],
  providers: [ProductService, VariantService, CategoryService],
  exports: [ProductService, VariantService],
})
export class ProductModule {}
