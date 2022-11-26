import { CustomerRepositoryInterface } from '../../../domain/customer/repository/customer-repository.interface'
import {
  InputFindCustomerDto,
  OutputFindCustomerDto,
} from './find-customer-dto'

export class FindCustomerUsecase {
  constructor(
    private readonly customerRepository: CustomerRepositoryInterface,
  ) {}

  async execute(input: InputFindCustomerDto): Promise<OutputFindCustomerDto> {
    const result = await this.customerRepository.find(input.id)

    return {
      id: result.id,
      name: result.name,
      address: {
        street: result.address.street,
        city: result.address.city,
        number: result.address.number,
        zipcode: result.address.zipcode,
      },
    }
  }
}
