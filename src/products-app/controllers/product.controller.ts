import { ListMostViewedProductsQuery } from '../queries/list-most-viewed-products.query';
import { DeleteProductHandler } from '../commands/delete-product.handler';
import { GetProductQuery } from '../queries/get-product.query';
import { GetProductQueryHandler } from '../queries/get-products.queryhandler';
import {
  Controller,
  Post,
  Body,
  Get,
  Param,
  Query,
  NotFoundException,
  Delete,
} from '@nestjs/common';
import { CreateProductCommand } from '../commands/create-product.command';
import { CreateProductHandler } from '../commands/create-product.handler';
import { Currency } from '../enums/currency-enum';
import { Product } from '../domain/Product.entity';
import { CurrencyService } from '../services/currency.service';
import { MostViewedProductsHandler } from '../queries/list-most-viewed-products.queryhandler';

@Controller('products')
export class ProductController {
  constructor(
    private readonly createProductHandler: CreateProductHandler,
    private readonly getProductQueryHandler: GetProductQueryHandler,
    private readonly currencyService: CurrencyService,
    private readonly deleteProductHandler: DeleteProductHandler,
    private readonly mostViewedProductsHandler: MostViewedProductsHandler,
  ) {}

  @Post()
  async createProduct(
    @Body('name') name: string,
    @Body('description') description: string,
    @Body('price') price: number,
  ) {
    const command = new CreateProductCommand(name, price, description);
    const result = await this.createProductHandler.execute(command);
    return result;
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<{ success: boolean }> {
    const result = await this.deleteProductHandler.execute({ id });
    return { success: result };
  }

  @Get('most-viewed')
  async getMostViewed(
    @Query('limit') limit = 5,
    @Query('currency') currency?: string,
  ): Promise<Product[]> {
    const query = new ListMostViewedProductsQuery(limit, currency);
    return await this.mostViewedProductsHandler.execute(query);
  }

  @Get(':id')
  async getProduct(
    @Param('id') id: number,
    @Query('currency') currency: Currency = Currency.USD,
  ): Promise<Product> {
    const query = new GetProductQuery(id);
    const conversionRate =
      currency !== Currency.USD
        ? await this.currencyService.getConversionRate(
            Currency.USD,
            currency as Currency,
          )
        : 1;
    const product = await this.getProductQueryHandler.execute(query);
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    const price = product.price * conversionRate;
    return { ...product, price };
  }
}
