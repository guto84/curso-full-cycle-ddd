import { Address } from '../value-object/address'
import { CustomerFactory } from './customer-factory'

describe('Customer factory', () => {
  it('should create a customer', () => {
    const customer = CustomerFactory.create('guto')
    expect(customer.id).toBeDefined()
    expect(customer.name).toBe('guto')
    expect(customer.address).toBeUndefined()
  })

  it('should create a customer with an address', () => {
    const address = new Address('street', 123, '13990000', 'pinhal')
    const customer = CustomerFactory.createWithAddress('guto', address)
    expect(customer.id).toBeDefined()
    expect(customer.name).toBe('guto')
    expect(customer.address).toBe(address)
  })
})
