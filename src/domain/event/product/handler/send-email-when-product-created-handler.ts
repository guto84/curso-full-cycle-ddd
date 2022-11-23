import { EventHandlerInterface } from '../../@shared'
import { ProductCreatedEvent } from '../../product'

export class SendEmailWhenProductCreatedHandler
  implements EventHandlerInterface<ProductCreatedEvent>
{
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handle(event: ProductCreatedEvent): void {
    console.log(`sending email to ...`)
  }
}
