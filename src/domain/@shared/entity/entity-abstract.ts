import Notification from '../notification/notification'

export abstract class Entity {
  protected id: string
  protected notification: Notification

  constructor() {
    this.notification = new Notification()
  }
}
