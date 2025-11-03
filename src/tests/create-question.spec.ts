import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question'
import { InMemoryQuestionsRepository } from './repositories/in-memory-questions-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryQuestionAttachmentsRepository } from './repositories/in-memory-question-attachments-repository'

let inMemoryRepository: InMemoryQuestionsRepository
let inMemoryAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let sut: CreateQuestionUseCase

describe('Create Question Use Case', () => {
  beforeEach(() => {
    inMemoryAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    inMemoryRepository = new InMemoryQuestionsRepository(
      inMemoryAttachmentsRepository,
    )
    sut = new CreateQuestionUseCase(inMemoryRepository)
  })
  it('should be able to create a question', async () => {
    const result = await sut.execute({
      authorId: 'author-1',
      title: 'How to learn TypeScript?',
      content: 'This is an question.',
      attachmentsIds: ['att-1', 'att-2'],
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryRepository.items[0]).toEqual(result.value?.question)
    expect(inMemoryRepository.items[0].attachments.currentItems).toHaveLength(2)
    expect(inMemoryRepository.items[0].attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID('att-1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityID('att-2') }),
    ])
  })
})
