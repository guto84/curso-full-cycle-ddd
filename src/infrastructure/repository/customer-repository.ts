import { Address, Customer } from '../../domain/entity'
import { CustomerRepositoryInterface } from '../../domain/repository'
import { CustomerModel } from '../db/sequelize/model'

export class CustomerRepository implements CustomerRepositoryInterface {
  async create(entity: Customer): Promise<void> {
    await CustomerModel.create({
      id: entity.id,
      name: entity.name,
      street: entity.address.street,
      number: entity.address.number,
      zipcode: entity.address.zipcode,
      city: entity.address.city,
      active: entity.isActive(),
      rewardPoints: entity.rewardPoints,
    })
  }

  async update(entity: Customer): Promise<void> {
    await CustomerModel.update(
      {
        id: entity.id,
        name: entity.name,
        street: entity.address.street,
        number: entity.address.number,
        zipcode: entity.address.zipcode,
        city: entity.address.city,
        active: entity.isActive(),
        rewardPoints: entity.rewardPoints,
      },
      {
        where: {
          id: entity.id,
        },
      },
    )
  }

  async find(id: string): Promise<Customer> {
    try {
      const customerModel = await CustomerModel.findOne({
        where: { id },
        rejectOnEmpty: true,
      })
      const customer = new Customer(customerModel.id, customerModel.name)
      const address = new Address(
        customerModel.street,
        customerModel.number,
        customerModel.zipcode,
        customerModel.city,
      )
      customer.changeAddress(address)
      return customer
    } catch (error) {
      throw new Error('customer not found')
    }
  }

  async findAll(): Promise<Customer[]> {
    const customerModels = await CustomerModel.findAll()
    const customers = customerModels.map((customerModel) => {
      const customer = new Customer(customerModel.id, customerModel.name)
      customer.addRewardPoints(customerModel.rewardPoints)
      const address = new Address(
        customerModel.street,
        customerModel.number,
        customerModel.zipcode,
        customerModel.city,
      )
      customer.changeAddress(address)
      if (customerModel.active) {
        customer.activate()
      }
      return customer
    })
    return customers
  }
}
