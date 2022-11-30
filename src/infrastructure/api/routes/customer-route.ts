import express, { Request, Response } from 'express'
import { CreateCustomerUsecase } from '../../../usecase/customer/create/create-customer-usecase'
import { FindAllCustomerUsecase } from '../../../usecase/customer/list/list-customer-usecase'
import { CustomerRepository } from '../../customer/repository/sequelize/customer-repository'

export const customerRoute = express.Router()

customerRoute.post('/', async (req: Request, res: Response) => {
  const usecase = new CreateCustomerUsecase(new CustomerRepository())
  try {
    const customerDto = {
      name: req.body.name,
      address: {
        street: req.body.address.street,
        city: req.body.address.city,
        number: req.body.address.number,
        zipcode: req.body.address.zipcode,
      },
    }
    const output = await usecase.execute(customerDto)
    res.send(output)
  } catch (error) {
    res.status(500).send(error)
  }
})

customerRoute.get('/', async (req: Request, res: Response) => {
  const usecase = new FindAllCustomerUsecase(new CustomerRepository())
  try {
    const output = await usecase.execute({})
    res.send(output)
  } catch (error) {
    res.status(500).send(error)
  }
})
