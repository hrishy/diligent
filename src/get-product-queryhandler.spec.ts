import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from './products-app/domain/Product.entity';
import { ProductRepository } from './products-app/repositories/product.repository';
import { GetProductQueryHandler } from './products-app/queries/get-products.queryhandler';
import { GetProductQuery } from './products-app/queries/get-product.query';

describe('GetProductQueryHandler', () => {
  let handler: GetProductQueryHandler;
  let productRepository: ProductRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductRepository,
        GetProductQueryHandler,
        {
          provide: getRepositoryToken(Product),
          useValue: {
            findOne: jest.fn(),
            update: jest.fn(),
          },
        },
      ],
    }).compile();
    productRepository = module.get<ProductRepository>(ProductRepository);
    handler = module.get<GetProductQueryHandler>(GetProductQueryHandler);
  });

  describe('execute', () => {
    it('should get a product and increment its view count', async () => {
      // Arrange
      const productId = 1;
      const product: Product = {
        id: productId,
        name: 'Product 1',
        price: 10,
        viewCount: 0,
        deleted: false,
      };
      jest.spyOn(productRepository, 'getProduct').mockResolvedValue(product);
      jest
        .spyOn(productRepository, 'updateProductViewCount')
        .mockResolvedValue();
      const query = new GetProductQuery(productId);

      // Act
      const result = await handler.execute(query);

      // Assert
      expect(result).toEqual(product);
      expect(productRepository.getProduct).toHaveBeenCalledWith(productId);
      expect(productRepository.updateProductViewCount).toHaveBeenCalledWith(
        productId,
        1,
      );
    });
  });
});
