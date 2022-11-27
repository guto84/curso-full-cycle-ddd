import { Product } from '../../../domain/product/entity/product'
import { FindProductUsecase } from './find-product-usecase'

const product = new Product('1', 'product', 10)

const input = {
  id: '1',
}

const MockRepository = () => {
  return {
    find: jest.fn().mockReturnValue(Promise.resolve(product)),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  }
}

describe('unit test for find product use case', () => {
  it('should find a product', async () => {
    const productRepository = MockRepository()
    const usecase = new FindProductUsecase(productRepository)

    const output = {
      id: '1',
      name: 'product',
      price: 10,
    }
    const result = await usecase.execute(input)

    expect(result).toEqual(output)
  })

  it('should throw an error when not find a product', () => {
    const productRepository = MockRepository()
    productRepository.find.mockImplementation(() => {
      throw new Error('product not found')
    })
    const usecase = new FindProductUsecase(productRepository)

    expect(async () => {
      return await usecase.execute(input)
    }).rejects.toThrow('product not found')
  })
})
