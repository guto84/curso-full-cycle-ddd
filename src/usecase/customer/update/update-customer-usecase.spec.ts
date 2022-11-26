import { CustomerFactory } from '../../../domain/customer/factory/customer-factory'
import { Address } from '../../../domain/customer/value-object/address'
import { UpdateCustomerUsecase } from './update-customer-usecase'

const customer = CustomerFactory.createWithAddress(
  'guto',
  new Address('rua', 123, '13990000', 'pinhal'),
)

const input = {
  id: customer.id,
  name: 'guto updated',
  address: {
    street: 'rua updated',
    city: 'pinhal updated',
    number: 12,
    zipcode: '13990000',
  },
}

const MockRepository = () => {
  return {
    find: jest.fn().mockReturnValue(Promise.resolve(customer)),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  }
}

describe('unit test fro update customer use case', () => {
  it('should create a customer', async () => {
    const customerRepository = MockRepository()
    const usecase = new UpdateCustomerUsecase(customerRepository)
    const output = await usecase.execute(input)

    expect(output).toEqual(input)
  })
})
