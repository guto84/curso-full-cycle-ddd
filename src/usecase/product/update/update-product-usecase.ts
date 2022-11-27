import { ProductRepositoryInterface } from '../../../domain/product/repository/product-repository.interface'
import {
  InputUpdateProductDto,
  OutputUpdateProductDto,
} from './update-product-dto'

export class UpdateProductUsecase {
  constructor(private readonly productRepository: ProductRepositoryInterface) {}

  async execute(input: InputUpdateProductDto): Promise<OutputUpdateProductDto> {
    const customer = await this.productRepository.find(input.id)
    customer.changeName(input.name)
    customer.changePrice(input.price)

    await this.productRepository.update(customer)

    return {
      id: customer.id,
      name: customer.name,
      price: customer.price,
    }
  }
}
