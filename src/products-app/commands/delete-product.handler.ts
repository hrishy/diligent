import { ProductRepository } from './../repositories/product.repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { DeleteProductCommand } from './delete-product.command';
import { Inject } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';

@CommandHandler(DeleteProductCommand)
export class DeleteProductHandler
  implements ICommandHandler<DeleteProductCommand>
{
  constructor(
    private readonly productRepository: ProductRepository,
    @Inject(CommandBus) private readonly commandBus: CommandBus,
  ) {}

  async execute(command: DeleteProductCommand): Promise<boolean> {
    const { id } = command;
    const result = await this.productRepository.delete(id);
    if (result) {
      await this.commandBus.execute(new DeleteProductCommand(id));
    }
    return result;
  }
}
