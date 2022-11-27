import { Product } from '../../../domain/product/entity/product'
import { ProductFactory } from '../../../domain/product/factory/product-factory'
import { FindAllProductUsecase } from './list-product-usecase'

const factory1 = ProductFactory.create('a', 'product 1', 10)
const product1 = new Product(factory1.id, factory1.name, factory1.price)

const factory2 = ProductFactory.create('b', 'product 2', 20)
const product2 = new Product(factory2.id, factory2.name, factory2.price)

const MockRepository = () => {
  return {
    find: jest.fn(),
    findAll: jest.fn().mockReturnValue(Promise.resolve([product1, product2])),
    create: jest.fn(),
    update: jest.fn(),
  }
}

describe('unit test for listing products use case', () => {
  it('should list a product', async () => {
    const productRepository = MockRepository()
    const usecase = new FindAllProductUsecase(productRepository)
    const output = await usecase.execute({})

    expect(output.products.length).toBe(2)

    expect(output.products[0].id).toBe(product1.id)
    expect(output.products[0].name).toBe(product1.name)
    expect(output.products[0].price).toBe(product1.price)

    expect(output.products[1].id).toBe(product2.id)
    expect(output.products[1].name).toBe(product2.name)
    expect(output.products[1].price).toBe(product2.price)
  })
})
