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

  it('should find an order', async () => {
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

    const orderFind = await orderRepository.find('1')

    expect(order).toStrictEqual(orderFind)
  })

  it('should throw an error when order is not found', async () => {
    const orderRepository = new OrderRepository()
    expect(async () => {
      await orderRepository.find('abc')
    }).rejects.toThrow('customer not found')
  })

  it('should find all orders', async () => {
    const customerRepository = new CustomerRepository()
    const productRepository = new ProductRepository()
    const orderRepository = new OrderRepository()

    const customer1 = new Customer('1', 'customer1')
    const address1 = new Address('rua1', 1, '13990000', 'city')
    customer1.changeAddress(address1)
    await customerRepository.create(customer1)

    const customer2 = new Customer('2', 'customer2')
    const address2 = new Address('rua2', 2, '13990000', 'city')
    customer2.changeAddress(address2)
    await customerRepository.create(customer2)

    const product1 = new Product('1', 'product1', 100)
    await productRepository.create(product1)

    const product2 = new Product('2', 'product2', 200)
    await productRepository.create(product2)

    const orderItem1 = new OrderItem(
      '1',
      product1.name,
      product1.price,
      product1.id,
      2,
    )
    const order1 = new Order('1', customer1.id, [orderItem1])
    await orderRepository.create(order1)

    const orderItem2 = new OrderItem(
      '2',
      product2.name,
      product2.price,
      product2.id,
      3,
    )
    const order2 = new Order('2', customer2.id, [orderItem2])
    await orderRepository.create(order2)

    const orderFindAll = await orderRepository.findAll()

    expect([order1, order2]).toStrictEqual(orderFindAll)
  })

  it('should update a order when add a new item', async () => {
    const customerRepository = new CustomerRepository()
    const customer = new Customer('1', 'customer')
    const address = new Address('rua', 1, '13990000', 'city')
    customer.changeAddress(address)
    await customerRepository.create(customer)

    const productRepository = new ProductRepository()
    const product1 = new Product('1', 'product', 100)
    await productRepository.create(product1)

    const product2 = new Product('2', 'product2', 200)
    await productRepository.create(product2)

    const orderItem1 = new OrderItem(
      '1',
      product1.name,
      product1.price,
      product1.id,
      2,
    )

    const orderItem2 = new OrderItem(
      '2',
      product2.name,
      product2.price,
      product2.id,
      1,
    )

    const order = new Order('1', customer.id, [orderItem1])

    const orderRepository = new OrderRepository()
    await orderRepository.create(order)

    order.changeItems([orderItem1, orderItem2])

    await orderRepository.update(order)

    // const orderModel = await OrderModel.findOne({
    //   where: { id: order.id },
    //   include: ['items'],
    // })

    // expect(orderModel.toJSON()).toStrictEqual({
    //   id: '1',
    //   customer_id: '1',
    //   total: order.total(),
    //   items: [
    //     {
    //       id: orderItem1.id,
    //       name: orderItem1.name,
    //       price: orderItem1.price,
    //       quantity: orderItem1.quantity,
    //       order_id: orderModel.id,
    //       product_id: product1.id,
    //     },
    //     {
    //       id: orderItem2.id,
    //       name: orderItem2.name,
    //       price: orderItem2.price,
    //       quantity: orderItem2.quantity,
    //       order_id: orderModel.id,
    //       product_id: product2.id,
    //     },
    //   ],
    // })
  })
})
