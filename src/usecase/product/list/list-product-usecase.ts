/* eslint-disable @typescript-eslint/no-unused-vars */
import { Product } from '../../../domain/product/entity/product'
import { ProductRepositoryInterface } from '../../../domain/product/repository/product-repository.interface'
import { InputListProductDto, OutputListProductDto } from './list-product-dto'

export class FindAllProductUsecase {
  constructor(private readonly productRepository: ProductRepositoryInterface) {}

  async execute(input: InputListProductDto): Promise<OutputListProductDto> {
    const result = await this.productRepository.findAll()
    return OutputMapper.toOutput(result)
  }
}

class OutputMapper {
  static toOutput(product: Product[]): OutputListProductDto {
    return {
      products: product.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
      })),
    }
  }
}
