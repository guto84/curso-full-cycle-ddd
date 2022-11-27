import { Product } from '../../../domain/product/entity/product'
import { ProductFactory } from '../../../domain/product/factory/product-factory'
import { UpdateProductUsecase } from './update-product-usecase'

const factory = ProductFactory.create('a', 'product', 10)
const product = new Product(factory.id, factory.name, factory.price)

const input = {
  id: product.id,
  name: 'product updated',
  price: 12,
}

const MockRepository = () => {
  return {
    find: jest.fn().mockReturnValue(Promise.resolve(product)),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  }
}

describe('unit test from update product use case', () => {
  it('should update a product', async () => {
    const productRepository = MockRepository()
    const usecase = new UpdateProductUsecase(productRepository)
    const output = await usecase.execute(input)

    expect(output).toEqual(input)
  })
})
