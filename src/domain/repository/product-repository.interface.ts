import { Product } from '../entity'
import { RepositoryInterface } from '../repository'

export interface ProductRepositoryInterface
  extends RepositoryInterface<Product> {}
