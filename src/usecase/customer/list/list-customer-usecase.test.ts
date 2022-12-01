import { Sequelize } from 'sequelize-typescript'
import { CustomerFactory } from '../../../domain/customer/factory/customer-factory'
import { Address } from '../../../domain/customer/value-object/address'
import { CustomerModel } from '../../../infrastructure/customer/repository/sequelize/customer-model'
import { CustomerRepository } from '../../../infrastructure/customer/repository/sequelize/customer-repository'
import { CreateCustomerUsecase } from '../create/create-customer-usecase'
import { FindAllCustomerUsecase } from './list-customer-usecase'

describe('integration test for listing customers use case', () => {
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

  it('should list a customer', async () => {
    const customerRepository = new CustomerRepository()

    const customer1 = CustomerFactory.createWithAddress(
      'guto',
      new Address('rua', 123, '13990000', 'pinhal'),
    )
    const customer2 = CustomerFactory.createWithAddress(
      'fulano',
      new Address('rua perdida', 23, '13990000', 'pinhal'),
    )
    const createUsecase = new CreateCustomerUsecase(customerRepository)
    await createUsecase.execute(customer1)
    await createUsecase.execute(customer2)

    const usecase = new FindAllCustomerUsecase(customerRepository)
    const output = await usecase.execute({})

    expect(output.customers.length).toBe(2)

    expect(output.customers[0].id).toBeDefined()
    expect(output.customers[0].name).toBe(customer1.name)
    expect(output.customers[0].address.street).toBe(customer1.address.street)

    expect(output.customers[1].id).toBeDefined()
    expect(output.customers[1].name).toBe(customer2.name)
    expect(output.customers[1].address.street).toBe(customer2.address.street)
  })
})
