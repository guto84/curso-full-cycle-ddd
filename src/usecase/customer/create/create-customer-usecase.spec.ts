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

const MockRepository = () => {
  return {
    find: jest.fn(),
    findAll: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  }
}

describe('unit test for create customer use case', () => {
  it('should create a customer', async () => {
    const customerRepository = MockRepository()
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
    const customerRepository = MockRepository()
    const usecase = new CreateCustomerUsecase(customerRepository)
    input.name = ''

    await expect(usecase.execute(input)).rejects.toThrow('Name is required')
  })

  it('should throw an error when street is missing', async () => {
    const customerRepository = MockRepository()
    const usecase = new CreateCustomerUsecase(customerRepository)
    input.address.street = ''

    await expect(usecase.execute(input)).rejects.toThrow('Street is required')
  })
})
