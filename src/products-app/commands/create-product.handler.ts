import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateProductCommand } from './create-product.command';
import { ProductRepository } from '../repositories/product.repository';
import { Product } from '../domain/Product.entity';

@CommandHandler(CreateProductCommand)
export class CreateProductHandler
  implements ICommandHandler<CreateProductCommand>
{
  constructor(private readonly productRepository: ProductRepository) {}

  async execute(command: CreateProductCommand): Promise<void> {
    const { name, price, description } = command;
    const product = Product.create({ name, price, description });
    await this.productRepository.create(product);
  }
}
