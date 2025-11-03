import { AnswerQuestionUseCase } from '@/domain/forum/application/use-cases/answer-question'
import { InMemoryAnswersRepository } from '../repositories/in-memory-answers-repository'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryAnswerAttachmentsRepository } from '../repositories/in-memory-answer-attachment-repository'

let inMemoryAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryRepository: InMemoryAnswersRepository
let sut: AnswerQuestionUseCase

describe('Answer Question Use Case', () => {
  beforeEach(() => {
    inMemoryAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    inMemoryRepository = new InMemoryAnswersRepository(
      inMemoryAttachmentsRepository,
    )
    sut = new AnswerQuestionUseCase(inMemoryRepository)
  })

  it('should be able to answer a question', async () => {
    const result = await sut.execute({
      questionId: 'question-1',
      instructorId: 'instructor-1',
      content: 'This is an answer to the question.',
      attachmentsIds: ['att-1', 'att-2'],
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryRepository.items[0]).toEqual(result.value?.answer)
    expect(inMemoryRepository.items[0].attachments.currentItems).toHaveLength(2)
    expect(inMemoryRepository.items[0].attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID('att-1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityID('att-2') }),
    ])
  })
})
