/* eslint-disable @typescript-eslint/no-unused-vars */
import { Customer } from '../../../domain/customer/entity/customer'
import { CustomerRepositoryInterface } from '../../../domain/customer/repository/customer-repository.interface'
import {
  InputListCustomerDto,
  OutputListCustomerDto,
} from './list-customer-dto'

export class FindAllCustomerUsecase {
  constructor(
    private readonly customerRepository: CustomerRepositoryInterface,
  ) {}

  async execute(input: InputListCustomerDto): Promise<OutputListCustomerDto> {
    const result = await this.customerRepository.findAll()
    return OutputMapper.toOutput(result)
  }
}

class OutputMapper {
  static toOutput(customer: Customer[]): OutputListCustomerDto {
    return {
      customers: customer.map((item) => ({
        id: item.id,
        name: item.name,
        address: {
          street: item.address.street,
          city: item.address.city,
          number: item.address.number,
          zipcode: item.address.zipcode,
        },
      })),
    }
  }
}
