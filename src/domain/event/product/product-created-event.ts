/* eslint-disable @typescript-eslint/no-explicit-any */
import { EventInterface } from '../../event/@shared'

export class ProductCreatedEvent implements EventInterface {
  dataTimeOcurred: Date
  eventData: any

  constructor(eventData: any) {
    this.dataTimeOcurred = new Date()
    this.eventData = eventData
  }
}
