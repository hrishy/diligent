import { ProductRepository } from './../repositories/product.repository';
import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetProductQuery } from '../queries/get-product.query';
import { Product } from '../domain/Product.entity';

@QueryHandler(GetProductQuery)
export class GetProductQueryHandler
  implements IQueryHandler<GetProductQuery, Product>
{
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(query: GetProductQuery): Promise<Product> {
    const { id } = query;

    // Get the product and increment its view count
    const product = await this.productRepository.getProduct(id);
    product.viewCount++;
    await this.productRepository.updateProductViewCount(
      product.id,
      product.viewCount,
    );
    return product;
  }
}
