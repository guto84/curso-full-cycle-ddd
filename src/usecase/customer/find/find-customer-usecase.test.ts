import { Sequelize } from 'sequelize-typescript'
import { Customer } from '../../../domain/customer/entity/customer'
import { Address } from '../../../domain/customer/value-object/address'
import { CustomerModel } from '../../../infrastructure/customer/repository/sequelize/customer-model'
import { CustomerRepository } from '../../../infrastructure/customer/repository/sequelize/customer-repository'
import { FindCustomerUsecase } from './find-customer-usecase'

describe('integration test for find customer use case', () => {
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

  it('should find a customer', async () => {
    const customerRepository = new CustomerRepository()
    const usecase = new FindCustomerUsecase(customerRepository)

    const customer = new Customer('1', 'guto')
    const address = new Address('rua', 123, '13990000', 'pinhal')
    customer.changeAddress(address)
    await customerRepository.create(customer)

    const input = {
      id: '1',
    }
    const output = {
      id: '1',
      name: 'guto',
      address: {
        street: 'rua',
        city: 'pinhal',
        number: 123,
        zipcode: '13990000',
      },
    }
    const result = await usecase.execute(input)

    expect(result).toEqual(output)
  })
})
