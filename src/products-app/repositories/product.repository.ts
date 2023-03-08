import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../domain/Product.entity';
import { IProductRepository } from './Iproduct.repository';

@Injectable()
export class ProductRepository implements IProductRepository {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  async create(product: Product): Promise<Product> {
    await this.productRepository.insert(product);
    return product;
  }

  async getProduct(id: number): Promise<Product> {
    // Retrieve the product from the database
    const product = await this.productRepository.findOneBy({
      id,
      deleted: false,
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }

    // If a currency other than USD was requested
    //convert the price
    return product;
  }

  async updateProductViewCount(id: number, viewCount: number) {
    const product = await this.getProduct(id);
    await this.productRepository.update(product.id, { viewCount });
  }

  async delete(id: number): Promise<boolean> {
    const existingProduct = await this.productRepository.findOneBy({ id });
    if (!existingProduct || existingProduct.deleted) {
      return false;
    }
    existingProduct.deleted = true;
    await this.productRepository.save(existingProduct);
    return true;
  }

  async getMostViewed(limit = 5): Promise<Product[]> {
    const queryBuilder = this.productRepository
      .createQueryBuilder('product')
      .orderBy('product.viewCount', 'DESC')
      .take(limit)
      .where('product.viewCount > :count AND product.deleted = :deleted', {
        count: 0,
        deleted: false,
      });
    return queryBuilder.getMany();
  }
}
