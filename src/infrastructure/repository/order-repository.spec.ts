import { Sequelize } from 'sequelize-typescript'
import {
  Address,
  Customer,
  Order,
  OrderItem,
  Product,
} from '../../domain/entity'
import {
  CustomerModel,
  OrderItemModel,
  OrderModel,
  ProductModel,
} from '../db/sequelize/model'
import { CustomerRepository } from './customer-repository'
import { OrderRepository } from './order-repository'
import { ProductRepository } from './product-repository'

describe('Order repository', () => {
  let sequelize: Sequelize

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true },
    })

    sequelize.addModels([
      CustomerModel,
      OrderModel,
      OrderItemModel,
      ProductModel,
    ])
    await sequelize.sync()
  })

  afterEach(async () => {
    await sequelize.close()
  })

  it('should create a new order', async () => {
    const customerRepository = new CustomerRepository()
    const customer = new Customer('1', 'customer')
    const address = new Address('rua', 1, '13990000', 'city')
    customer.changeAddress(address)
    await customerRepository.create(customer)

    const productRepository = new ProductRepository()
    const product = new Product('1', 'product', 100)
    await productRepository.create(product)

    const orderItem = new OrderItem(
      '1',
      product.name,
      product.price,
      product.id,
      2,
    )

    const order = new Order('1', customer.id, [orderItem])

    const orderRepository = new OrderRepository()
    await orderRepository.create(order)

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ['items'],
    })

    expect(orderModel.toJSON()).toStrictEqual({
      id: '1',
      customer_id: '1',
      total: order.total(),
      items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          price: orderItem.price,
          quantity: orderItem.quantity,
          order_id: '1',
          product_id: '1',
        },
      ],
    })
  })
})
