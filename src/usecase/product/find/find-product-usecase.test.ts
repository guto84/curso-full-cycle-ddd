import { Sequelize } from 'sequelize-typescript'
import { ProductModel } from '../../../infrastructure/product/repository/sequelize/product-model'
import { ProductRepository } from '../../../infrastructure/product/repository/sequelize/product-repository'
import { CreateProductUsecase } from '../create/create-product-usecase'
import { FindProductUsecase } from './find-product-usecase'

describe('integration test for find product use case', () => {
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

  it('should find a product', async () => {
    const productRepository = new ProductRepository()

    const createUsecase = new CreateProductUsecase(productRepository)
    const createInput = {
      type: 'a',
      name: 'product',
      price: 10,
    }
    const response = await createUsecase.execute(createInput)

    const usecase = new FindProductUsecase(productRepository)
    const input = {
      id: response.id,
    }
    const output = {
      id: response.id,
      name: 'product',
      price: 10,
    }
    const result = await usecase.execute(input)

    expect(result).toEqual(output)
  })
})
