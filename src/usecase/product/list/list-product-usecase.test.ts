import { Sequelize } from 'sequelize-typescript'
import { ProductModel } from '../../../infrastructure/product/repository/sequelize/product-model'
import { ProductRepository } from '../../../infrastructure/product/repository/sequelize/product-repository'
import { CreateProductUsecase } from '../create/create-product-usecase'
import { FindAllProductUsecase } from './list-product-usecase'

describe('integration test for listing products use case', () => {
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

  it('should list a product', async () => {
    const productRepository = new ProductRepository()
    const createUsecase = new CreateProductUsecase(productRepository)

    const inputProduct1 = {
      type: 'a',
      name: 'product 1',
      price: 10,
    }
    const product1 = await createUsecase.execute(inputProduct1)

    const inputProduct2 = {
      type: 'a',
      name: 'product 2',
      price: 20,
    }
    const product2 = await createUsecase.execute(inputProduct2)

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
