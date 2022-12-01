import { app, sequelize } from '../express'
import request from 'supertest'

describe('E2E test for product', () => {
  beforeEach(async () => {
    await sequelize.sync({ force: true })
  })

  afterAll(async () => {
    await sequelize.close()
  })

  it('should create a product', async () => {
    const response = await request(app).post('/products').send({
      type: 'a',
      name: 'product',
      price: 10,
    })

    expect(response.status).toBe(200)
    expect(response.body.name).toBe('product')
    expect(response.body.price).toBe(10)
  })

  it('should not create a product', async () => {
    const response = await request(app).post('/products').send({
      type: 'a',
      name: '',
      price: 10,
    })
    expect(response.status).toBe(500)
  })

  it('should list all products', async () => {
    await request(app).post('/products').send({
      type: 'a',
      name: 'product 1',
      price: 10,
    })
    await request(app).post('/products').send({
      type: 'a',
      name: 'product 2',
      price: 20,
    })

    const listResponse = await request(app).get('/products').send()

    expect(listResponse.status).toBe(200)
    expect(listResponse.body.products.length).toBe(2)

    const product1 = listResponse.body.products[0]
    expect(product1.name).toBe('product 1')
    expect(product1.price).toBe(10)

    const product2 = listResponse.body.products[1]
    expect(product2.name).toBe('product 2')
    expect(product2.price).toBe(20)
  })
})
