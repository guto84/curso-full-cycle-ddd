import { EventInterface, EventHandlerInterface } from '../../event/@shared'

export interface EventDispatcherInterface {
  notify(event: EventInterface): void

  register(eventName: string, eventHandler: EventHandlerInterface): void

  unregister(eventName: string, eventHandler: EventHandlerInterface): void

  unregisterAll(): void
}
