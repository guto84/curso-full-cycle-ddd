import { CreateProductUsecase } from './create-product-usecase'

const MockRepository = () => {
  return {
    find: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  }
}

describe('unit test for create product use case', () => {
  it('should create a product', async () => {
    const productRepository = MockRepository()
    const usecase = new CreateProductUsecase(productRepository)
    const input = {
      type: 'a',
      name: 'product',
      price: 10,
    }
    const output = await usecase.execute(input)

    expect(output).toEqual({
      id: expect.any(String),
      name: input.name,
      price: 10,
    })
  })

  it('should throw an error when name is missing', async () => {
    const productRepository = MockRepository()
    const usecase = new CreateProductUsecase(productRepository)
    const input = {
      type: 'a',
      name: '',
      price: 10,
    }

    await expect(usecase.execute(input)).rejects.toThrow('Name is required')
  })

  it('should throw an error when price is incorect', async () => {
    const productRepository = MockRepository()
    const usecase = new CreateProductUsecase(productRepository)
    const input = {
      type: 'a',
      name: 'guto',
      price: -10,
    }

    await expect(usecase.execute(input)).rejects.toThrow(
      'Price must be greater than zero',
    )
  })
})
