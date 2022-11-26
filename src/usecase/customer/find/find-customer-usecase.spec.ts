import { Customer } from '../../../domain/customer/entity/customer'
import { Address } from '../../../domain/customer/value-object/address'
import { FindCustomerUsecase } from './find-customer-usecase'

const customer = new Customer('1', 'guto')
const address = new Address('rua', 123, '13990000', 'pinhal')
customer.changeAddress(address)

const input = {
  id: '1',
}

const MockRepository = () => {
  return {
    find: jest.fn().mockReturnValue(Promise.resolve(customer)),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  }
}

describe('unit test for find customer use case', () => {
  it('should find a customer', async () => {
    const customerRepository = MockRepository()
    const usecase = new FindCustomerUsecase(customerRepository)

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

  it('should throw an error when not find a customer', () => {
    const customerRepository = MockRepository()
    customerRepository.find.mockImplementation(() => {
      throw new Error('customer not found')
    })
    const usecase = new FindCustomerUsecase(customerRepository)

    expect(async () => {
      return await usecase.execute(input)
    }).rejects.toThrow('customer not found')
  })
})
