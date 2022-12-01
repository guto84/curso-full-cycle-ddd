import { Sequelize } from 'sequelize-typescript'
import { CustomerFactory } from '../../../domain/customer/factory/customer-factory'
import { Address } from '../../../domain/customer/value-object/address'
import { CustomerModel } from '../../../infrastructure/customer/repository/sequelize/customer-model'
import { CustomerRepository } from '../../../infrastructure/customer/repository/sequelize/customer-repository'
import { CreateCustomerUsecase } from '../create/create-customer-usecase'
import { UpdateCustomerUsecase } from './update-customer-usecase'

describe('integration test from update customer use case', () => {
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

  it('should update a customer', async () => {
    const customerRepository = new CustomerRepository()

    const customer = CustomerFactory.createWithAddress(
      'guto',
      new Address('rua', 123, '13990000', 'pinhal'),
    )
    const createUsecase = new CreateCustomerUsecase(customerRepository)
    const response = await createUsecase.execute(customer)

    const input = {
      id: response.id,
      name: 'guto updated',
      address: {
        street: 'rua updated',
        city: 'pinhal updated',
        number: 12,
        zipcode: '13990000',
      },
    }
    const usecase = new UpdateCustomerUsecase(customerRepository)
    const output = await usecase.execute(input)

    expect(output).toEqual(input)
  })
})
