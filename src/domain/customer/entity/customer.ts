import { Entity } from '../../@shared/entity/entity-abstract'
import { NotificationError } from '../../@shared/notification/notification-error'
import { Address } from '../value-object/address'

export class Customer extends Entity {
  private _name = ''
  private _address!: Address
  private _active = false
  private _rewardPoints = 0

  constructor(id: string, name: string) {
    super()
    this._id = id
    this._name = name
    this.validate()

    if (this.notification.hasErrors()) {
      throw new NotificationError(this.notification.getErrors())
    }
  }

  get name(): string {
    return this._name
  }

  get address(): Address {
    return this._address
  }

  get rewardPoints(): number {
    return this._rewardPoints
  }

  validate() {
    if (this.id.length === 0) {
      this.notification.addError({
        context: 'customer',
        message: 'Id is required',
      })
    }
    if (this._name.length === 0) {
      this.notification.addError({
        context: 'customer',
        message: 'Name is required',
      })
    }
  }

  changeName(name: string) {
    this._name = name
    this.validate()
  }

  changeAddress(address: Address) {
    this._address = address
  }

  isActive(): boolean {
    return this._active
  }

  activate() {
    if (this._address === undefined) {
      throw new Error('Address is mandatory to activate a customer')
    }
    this._active = true
  }

  deactivate() {
    this._active = false
  }

  addRewardPoints(points: number) {
    this._rewardPoints += points
  }
}
