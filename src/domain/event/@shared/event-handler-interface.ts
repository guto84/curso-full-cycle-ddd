import { EventInterface } from '../../event/@shared'

export interface EventHandlerInterface<
  T extends EventInterface = EventInterface,
> {
  handle(event: T): void
}
