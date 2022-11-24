import { SendEmailWhenProductCreatedHandler } from '../../product/event/handler/send-email-when-product-created-handler'
import { ProductCreatedEvent } from '../../product/event/product-created-event'
import { EventDispatcher } from './event-dispatcher'

describe('domain events tests', () => {
  it('should register an event handler', () => {
    const eventDispatcher = new EventDispatcher()
    const eventHandler = new SendEmailWhenProductCreatedHandler()

    eventDispatcher.register('ProductCreatedEvent', eventHandler)

    expect(
      eventDispatcher.getEventHandlers['ProductCreatedEvent'][0],
    ).toMatchObject(eventHandler)
    expect(
      eventDispatcher.getEventHandlers['ProductCreatedEvent'],
    ).toBeDefined()
    expect(eventDispatcher.getEventHandlers['ProductCreatedEvent'].length).toBe(
      1,
    )
  })

  it('should unregister an event handler', () => {
    const eventDispatcher = new EventDispatcher()
    const eventHandler = new SendEmailWhenProductCreatedHandler()

    eventDispatcher.register('ProductCreatedEvent', eventHandler)

    expect(
      eventDispatcher.getEventHandlers['ProductCreatedEvent'][0],
    ).toMatchObject(eventHandler)

    eventDispatcher.unregister('ProductCreatedEvent', eventHandler)

    expect(
      eventDispatcher.getEventHandlers['ProductCreatedEvent'],
    ).toBeDefined()
    expect(eventDispatcher.getEventHandlers['ProductCreatedEvent'].length).toBe(
      0,
    )
  })

  it('should unregister all event handler', () => {
    const eventDispatcher = new EventDispatcher()
    const eventHandler = new SendEmailWhenProductCreatedHandler()

    eventDispatcher.register('ProductCreatedEvent', eventHandler)

    expect(
      eventDispatcher.getEventHandlers['ProductCreatedEvent'][0],
    ).toMatchObject(eventHandler)

    eventDispatcher.unregisterAll()

    expect(
      eventDispatcher.getEventHandlers['ProductCreatedEvent'],
    ).toBeUndefined()
  })

  it('should notify all events handlers', () => {
    const eventDispatcher = new EventDispatcher()
    const eventHandler = new SendEmailWhenProductCreatedHandler()
    const spyEventHandler = jest.spyOn(eventHandler, 'handle')

    eventDispatcher.register('ProductCreatedEvent', eventHandler)

    expect(
      eventDispatcher.getEventHandlers['ProductCreatedEvent'][0],
    ).toMatchObject(eventHandler)

    const productCreatedEvent = new ProductCreatedEvent({
      name: 'product',
      description: 'product description',
      price: 10,
    })

    // quando o notify for executado o SendEmailWhenProductCreatedHandler.handle() deve ser executado
    eventDispatcher.notify(productCreatedEvent)

    expect(spyEventHandler).toHaveBeenCalled()
  })
})
