import { Test, TestingModule } from '@nestjs/testing';
import { DeleteProductHandler } from '../src/products-app/commands/delete-product.handler';
import { DeleteProductCommand } from '../src/products-app/commands/delete-product.command';
import { ProductRepository } from '../src/products-app/repositories/product.repository';
import { CommandBus } from '@nestjs/cqrs';

describe('DeleteProductHandler', () => {
  let handler: DeleteProductHandler;
  let productRepository: ProductRepository;
  let commandBus: CommandBus;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DeleteProductHandler,
        {
          provide: ProductRepository,
          useValue: {
            delete: jest.fn(),
          },
        },
        {
          provide: CommandBus,
          useValue: {
            execute: jest.fn(),
          },
        },
      ],
    }).compile();

    handler = module.get<DeleteProductHandler>(DeleteProductHandler);
    productRepository = module.get<ProductRepository>(ProductRepository);
    commandBus = module.get<CommandBus>(CommandBus);
  });

  describe('execute', () => {
    it('should delete the product and execute a DeleteProductCommand', async () => {
      // Arrange
      const id = 123;
      const command = new DeleteProductCommand(id);
      const expectedResult = true;
      const deleteSpy = jest
        .spyOn(productRepository, 'delete')
        .mockResolvedValue(expectedResult);
      const executeSpy = jest
        .spyOn(commandBus, 'execute')
        .mockResolvedValue(undefined);

      // Act
      const result = await handler.execute(command);

      // Assert
      expect(result).toBe(expectedResult);
      expect(deleteSpy).toHaveBeenCalledWith(id);
      expect(executeSpy).toHaveBeenCalledWith(command);
    });
  });
});
