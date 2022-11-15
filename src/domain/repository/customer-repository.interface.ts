import { Customer } from '../entity'
import { RepositoryInterface } from '.'

export interface CustomerRepositoryInterface
  extends RepositoryInterface<Customer> {}
