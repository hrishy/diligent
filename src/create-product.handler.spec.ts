import { CreateProductCommand } from './../src/products-app/commands/create-product.command';
import { Test } from '@nestjs/testing';
import { CreateProductHandler } from '../src/products-app/commands/create-product.handler';
import { ProductRepository } from '../src/products-app/repositories/product.repository';
import { Product } from '../src/products-app/domain/product.entity';

describe('CreateProductHandler', () => {
  let handler: CreateProductHandler;
  let productRepository: ProductRepository;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        CreateProductHandler,
        {
          provide: ProductRepository,
          useValue: {
            create: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = moduleRef.get<CreateProductHandler>(CreateProductHandler);
    productRepository = moduleRef.get<ProductRepository>(ProductRepository);
  });

  it('should create a product', async () => {
    const command = new CreateProductCommand('Product 1', 100, 'Description');
    const product = Product.create({
      name: 'Product 1',
      price: 100,
      description: 'Description',
    });
    jest.spyOn(productRepository, 'create').mockResolvedValue(product);
    await handler.execute(command);
    expect(productRepository.create).toHaveBeenCalledWith(product);
  });
});
