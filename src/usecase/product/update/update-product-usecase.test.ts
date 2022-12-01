import { Sequelize } from 'sequelize-typescript'
import { ProductModel } from '../../../infrastructure/product/repository/sequelize/product-model'
import { ProductRepository } from '../../../infrastructure/product/repository/sequelize/product-repository'
import { CreateProductUsecase } from '../create/create-product-usecase'
import { UpdateProductUsecase } from './update-product-usecase'

describe('integration test from update product use case', () => {
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

  it('should update a product', async () => {
    const productRepository = new ProductRepository()

    const createUsecase = new CreateProductUsecase(productRepository)
    const createInput = {
      type: 'a',
      name: 'product',
      price: 10,
    }
    const response = await createUsecase.execute(createInput)

    const usecase = new UpdateProductUsecase(productRepository)
    const input = {
      id: response.id,
      name: 'product updated',
      price: 12,
    }
    const output = await usecase.execute(input)

    expect(output).toEqual(input)
  })
})
