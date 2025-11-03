/* eslint-disable @typescript-eslint/no-explicit-any */
import { UniqueEntityID } from './unique-entity-id'

export class Entity<Props> {
  private _id: UniqueEntityID
  protected props: Props

  get id() {
    return this._id
  }

  protected constructor(props: Props, id?: UniqueEntityID) {
    this.props = props
    this._id = id ?? new UniqueEntityID(id)
  }

  public equals(entity: Entity<any>): boolean {
    if (entity === this) {
      return true
    }
    if (entity.id === this.id) {
      return true
    }
    return false
  }
}
