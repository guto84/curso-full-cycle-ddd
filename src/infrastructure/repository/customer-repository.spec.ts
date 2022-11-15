import { Sequelize } from 'sequelize-typescript'
import { Address, Customer } from '../../domain/entity'
import { CustomerModel } from '../db/sequelize/model'
import { CustomerRepository } from './customer-repository'

describe('Customer repository', () => {
  let sequelize: Sequelize

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
      sync: { force: true },
    })

    sequelize.addModels([CustomerModel])
    await sequelize.sync()
  })

  afterEach(async () => {
    await sequelize.close()
  })

  it('should create a customer', async () => {
    const customerRepository = new CustomerRepository()
    const customer = new Customer('123', 'Customer 1')
    const address = new Address('Street 1', 1, 'Zipcode 1', 'City 1')
    customer.changeAddress(address)
    await customerRepository.create(customer)

    const customerModel = await CustomerModel.findOne({ where: { id: '123' } })

    expect(customerModel.toJSON()).toStrictEqual({
      id: '123',
      name: customer.name,
      active: customer.isActive(),
      rewardPoints: customer.rewardPoints,
      street: address.street,
      number: address.number,
      zipcode: address.zipcode,
      city: address.city,
    })
  })

  it('should update a customer', async () => {
    const customerRepository = new CustomerRepository()
    const customer = new Customer('123', 'Customer 1')
    const address = new Address('Street 1', 1, 'Zipcode 1', 'City 1')
    customer.changeAddress(address)
    await customerRepository.create(customer)

    customer.changeName('customer edit')
    await customerRepository.update(customer)
    const customerModel = await CustomerModel.findOne({ where: { id: '123' } })

    expect(customerModel.toJSON()).toStrictEqual({
      id: '123',
      name: customer.name,
      active: customer.isActive(),
      rewardPoints: customer.rewardPoints,
      street: address.street,
      number: address.number,
      zipcode: address.zipcode,
      city: address.city,
    })
  })

  it('should find a customer', async () => {
    const customerRepository = new CustomerRepository()
    const customer = new Customer('123', 'Customer 1')
    const address = new Address('Street 1', 1, 'Zipcode 1', 'City 1')
    customer.changeAddress(address)
    await customerRepository.create(customer)

    const customerFind = await customerRepository.find('123')

    expect(customer).toStrictEqual(customerFind)
  })

  it('should throw an error when customer is not found', async () => {
    const customerRepository = new CustomerRepository()
    expect(async () => {
      await customerRepository.find('abc')
    }).rejects.toThrow('customer not found')
  })

  it('should find all products', async () => {
    const customerRepository = new CustomerRepository()

    const customer1 = new Customer('1', 'customer 1')
    const address1 = new Address('Street 1', 1, 'Zipcode 1', 'City 1')
    customer1.changeAddress(address1)
    await customerRepository.create(customer1)

    const customer2 = new Customer('2', 'customer 2')
    const address2 = new Address('Street 2', 2, 'Zipcode 2', 'City 1')
    customer2.changeAddress(address2)
    await customerRepository.create(customer2)

    const customers = await customerRepository.findAll()

    expect(customers).toHaveLength(2)
    expect(customers).toContainEqual(customer1)
    expect(customers).toContainEqual(customer2)
  })
})
