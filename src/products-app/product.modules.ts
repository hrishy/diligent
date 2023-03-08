import { MostViewedProductsHandler } from './queries/list-most-viewed-products.queryhandler';
import { DeleteProductHandler } from './commands/delete-product.handler';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './domain/Product.entity';
import { ProductController } from './controllers/product.controller';
import { ProductRepository } from './repositories/product.repository';
import { CreateProductHandler } from './commands/create-product.handler';
import { GetProductQueryHandler } from './queries/get-products.queryhandler';
import { ConfigModule } from '@nestjs/config';
import { CurrencyService } from './services/currency.service';
import { DatabaseModule } from './database.module';
import appConfig from './config/app.config';
import { CqrsModule } from '@nestjs/cqrs';

@Module({
  imports: [
    ConfigModule.forFeature(appConfig), // <-- Scoped ConfigModule
    TypeOrmModule.forFeature([Product]),
    DatabaseModule, // <-- Import the DatabaseModule
    CqrsModule,
  ],
  controllers: [ProductController],
  providers: [
    ProductRepository,
    CreateProductHandler,
    GetProductQueryHandler,
    CurrencyService,
    DeleteProductHandler,
    MostViewedProductsHandler,
  ],
})
export class ProductModule {}
