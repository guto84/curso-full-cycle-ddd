import { ProductRepositoryInterface } from '../../../domain/product/repository/product-repository.interface'
import { InputFindProductDto, OutputFindProductDto } from './find-product-dto'

export class FindProductUsecase {
  constructor(private readonly productRepository: ProductRepositoryInterface) {}

  async execute(input: InputFindProductDto): Promise<OutputFindProductDto> {
    const result = await this.productRepository.find(input.id)

    return {
      id: result.id,
      name: result.name,
      price: result.price,
    }
  }
}
