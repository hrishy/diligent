import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Currency } from '../enums/currency-enum';
import { Product } from '../domain/Product.entity';
import { ProductRepository } from '../repositories/product.repository';
import { CurrencyService } from '../services/currency.service';
import { ListMostViewedProductsQuery } from './list-most-viewed-products.query';

@QueryHandler(ListMostViewedProductsQuery)
export class MostViewedProductsHandler
  implements IQueryHandler<ListMostViewedProductsQuery>
{
  constructor(
    private readonly productRepository: ProductRepository,
    private readonly currencyService: CurrencyService,
  ) {}

  async execute(query: ListMostViewedProductsQuery): Promise<Product[]> {
    const { limit = 5, currency } = query;
    let products = await this.productRepository.getMostViewed(limit);

    if (currency) {
      const conversionRate = await this.currencyService.getConversionRate(
        Currency.USD,
        currency as Currency,
      );
      products = products.map((product) => {
        product.price = product.price * conversionRate;
        return product;
      });
    }

    return products;
  }
}
