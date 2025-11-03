import { SendNotificationUseCase } from '@/domain/notification/application/use-cases/send-notification'
import { InMemoryNotificationsRepository } from '../repositories/in-memory-notifications-repository'

let inMemoryRepository: InMemoryNotificationsRepository
let sut: SendNotificationUseCase

describe('Send Notification Use Case', () => {
  beforeEach(() => {
    inMemoryRepository = new InMemoryNotificationsRepository()
    sut = new SendNotificationUseCase(inMemoryRepository)
  })
  it('should be able to send a notification', async () => {
    const result = await sut.execute({
      recipientId: 'author-1',
      title: 'How to learn TypeScript?',
      content: 'This is an notification.',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryRepository.items[0]).toEqual(result.value?.notification)
  })
})
