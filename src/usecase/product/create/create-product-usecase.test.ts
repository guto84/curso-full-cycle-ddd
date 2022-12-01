import { Sequelize } from 'sequelize-typescript'
import { ProductModel } from '../../../infrastructure/product/repository/sequelize/product-model'
import { ProductRepository } from '../../../infrastructure/product/repository/sequelize/product-repository'
import { CreateProductUsecase } from './create-product-usecase'

describe('integration test for create product use case', () => {
  let sequelize: Sequelize

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true },
    })

    sequelize.addModels([ProductModel])
    await sequelize.sync()
  })

  afterEach(async () => {
    await sequelize.close()
  })

  it('should create a product', async () => {
    const productRepository = new ProductRepository()
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
    const productRepository = new ProductRepository()
    const usecase = new CreateProductUsecase(productRepository)
    const input = {
      type: 'a',
      name: '',
      price: 10,
    }

    await expect(usecase.execute(input)).rejects.toThrow('Name is required')
  })

  it('should throw an error when price is incorect', async () => {
    const productRepository = new ProductRepository()
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
