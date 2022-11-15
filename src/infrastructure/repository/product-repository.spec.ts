import { Sequelize } from 'sequelize-typescript'
import { Product } from '../../domain/entity'
import { ProductModel } from '../db/sequelize/model'
import { ProductRepository } from './product-repository'

describe('Product repository', () => {
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
    const product = new Product('1', 'product', 100)

    await productRepository.create(product)

    const productModel = await ProductModel.findOne({ where: { id: '1' } })

    expect(productModel.toJSON()).toStrictEqual({
      id: '1',
      name: 'product',
      price: 100,
    })
  })

  it('should update a product', async () => {
    const productRepository = new ProductRepository()
    const product = new Product('1', 'product', 100)

    await productRepository.create(product)
    const productModel = await ProductModel.findOne({ where: { id: '1' } })
    expect(productModel.toJSON()).toStrictEqual({
      id: '1',
      name: 'product',
      price: 100,
    })

    product.changeName('product edit')
    product.changePrice(200)

    await productRepository.update(product)
    const productModelEdit = await ProductModel.findOne({ where: { id: '1' } })
    expect(productModelEdit.toJSON()).toStrictEqual({
      id: '1',
      name: 'product edit',
      price: 200,
    })
  })

  it('should find a product', async () => {
    const productRepository = new ProductRepository()
    const product = new Product('1', 'product', 100)

    await productRepository.create(product)
    const productModel = await ProductModel.findOne({ where: { id: '1' } })

    const productFind = await productRepository.find('1')
    expect(productModel.toJSON()).toStrictEqual({
      id: productFind.id,
      name: productFind.name,
      price: productFind.price,
    })
  })

  it('should find all products', async () => {
    const productRepository = new ProductRepository()
    const product1 = new Product('1', 'product 1', 100)
    await productRepository.create(product1)
    const product2 = new Product('2', 'product 2', 100)
    await productRepository.create(product2)

    const products = await productRepository.findAll()
    expect([product1, product2]).toEqual(products)
  })
})
