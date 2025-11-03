import { ReadNotificationUseCase } from '@/domain/notification/application/use-cases/read-notification'
import { InMemoryNotificationsRepository } from '../repositories/in-memory-notifications-repository'
import { makeNotification } from '../factories/make-notification'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/domain/forum/application/use-cases/errors/not-allowed-error'

let inMemoryRepository: InMemoryNotificationsRepository
let sut: ReadNotificationUseCase

describe('Read Notification Use Case', () => {
  beforeEach(() => {
    inMemoryRepository = new InMemoryNotificationsRepository()
    sut = new ReadNotificationUseCase(inMemoryRepository)
  })
  it('should be able to read a notification', async () => {
    const notification = makeNotification()
    await inMemoryRepository.create(notification)

    const result = await sut.execute({
      recipientId: notification.recipientId.toString(),
      notificationId: notification.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryRepository.items[0].readAt).toEqual(expect.any(Date))
  })

  it('should not be able to delete a notification from another user', async () => {
    const notification = makeNotification({
      recipientId: new UniqueEntityID('recipient-1'),
    })
    await inMemoryRepository.create(notification)

    const result = await sut.execute({
      recipientId: 'another-user',
      notificationId: notification.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
