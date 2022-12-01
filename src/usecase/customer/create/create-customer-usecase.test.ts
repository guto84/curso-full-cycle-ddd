import { Sequelize } from 'sequelize-typescript'
import { CustomerModel } from '../../../infrastructure/customer/repository/sequelize/customer-model'
import { CustomerRepository } from '../../../infrastructure/customer/repository/sequelize/customer-repository'
import { CreateCustomerUsecase } from './create-customer-usecase'

const input = {
  name: 'guto',
  address: {
    street: 'rua',
    city: 'pinhal',
    number: 123,
    zipcode: '13990000',
  },
}

describe('integration test for create customer use case', () => {
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
    const usecase = new CreateCustomerUsecase(customerRepository)

    const output = await usecase.execute(input)

    expect(output).toEqual({
      id: expect.any(String),
      name: input.name,
      address: {
        street: input.address.street,
        city: input.address.city,
        number: input.address.number,
        zipcode: input.address.zipcode,
      },
    })
  })

  it('should throw an error when name is missing', async () => {
    const customerRepository = new CustomerRepository()
    const usecase = new CreateCustomerUsecase(customerRepository)
    input.name = ''

    await expect(usecase.execute(input)).rejects.toThrow('Name is required')
  })

  it('should throw an error when street is missing', async () => {
    const customerRepository = new CustomerRepository()
    const usecase = new CreateCustomerUsecase(customerRepository)
    input.address.street = ''

    await expect(usecase.execute(input)).rejects.toThrow('Street is required')
  })
})
