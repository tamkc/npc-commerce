import { Module } from '@nestjs/common';
import { ProductService } from './product.service';
import { VariantService } from './variant.service';
import { CategoryService } from './category.service';
import { ProductController } from './product.controller';
import { VariantController } from './variant.controller';
import { CategoryController } from './category.controller';
import { StoreProductController } from './store-product.controller';

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
