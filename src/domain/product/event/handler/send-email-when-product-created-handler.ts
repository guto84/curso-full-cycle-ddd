import { EventHandlerInterface } from '../../../@shared/event/event-handler-interface'
import { ProductCreatedEvent } from '../product-created-event'

export class SendEmailWhenProductCreatedHandler
  implements EventHandlerInterface<ProductCreatedEvent>
{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handle(event: ProductCreatedEvent): void {
    // console.log(`sending email to ...`)
  }
}
