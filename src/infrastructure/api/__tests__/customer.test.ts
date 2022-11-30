import { app, sequelize } from '../express'
import request from 'supertest'

describe('E2E test for customer', () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true })
  })

  afterAll(async () => {
    await sequelize.close()
  })

  it('should create a customer', async () => {
    const response = await request(app)
      .post('/customers')
      .send({
        name: 'guto',
        address: {
          street: 'rua',
          number: 123,
          zipcode: '13990000',
          city: 'pinhal',
        },
      })

    expect(response.status).toBe(200)
    expect(response.body.name).toBe('guto')
    expect(response.body.address.street).toBe('rua')
    expect(response.body.address.city).toBe('pinhal')
    expect(response.body.address.number).toBe(123)
    expect(response.body.address.zipcode).toBe('13990000')
  })

  it('should not create a customer', async () => {
    const response = await request(app).post('/customers').send({
      name: 'guto',
    })
    expect(response.status).toBe(500)
  })

  it('should list all customers', async () => {
    await request(app)
      .post('/customers')
      .send({
        name: 'guto',
        address: {
          street: 'rua',
          number: 123,
          zipcode: '13990000',
          city: 'pinhal',
        },
      })
    await request(app)
      .post('/customers')
      .send({
        name: 'fulano',
        address: {
          street: 'rua do fulano',
          number: 12,
          zipcode: '13990000',
          city: 'pinhal',
        },
      })

    const listResponse = await request(app).get('/customers').send()

    expect(listResponse.status).toBe(200)
    expect(listResponse.body.customers.length).toBe(2)

    const customer1 = listResponse.body.customers[0]
    expect(customer1.name).toBe('guto')
    expect(customer1.address.street).toBe('rua')

    const customer2 = listResponse.body.customers[1]
    expect(customer2.name).toBe('fulano')
    expect(customer2.address.street).toBe('rua do fulano')
  })
})
