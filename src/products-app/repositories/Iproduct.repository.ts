import { Product } from '../domain/Product.entity';
import { Currency } from '../enums/currency-enum';

export interface IProductRepository {
  create(product: Product): Promise<Product>;
  getProduct(id: number, currency: Currency): Promise<Product>;
  delete(id: number): Promise<boolean>;
  getMostViewed(limit: number): Promise<Product[]>;
}
