import { InMemoryQuestionsRepository } from '../repositories/in-memory-questions-repository'
import { makeQuestion } from '../factories/make-question'
import { DeleteQuestionUseCase } from '@/domain/forum/application/use-cases/delete-question'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { NotAllowedError } from '@/domain/forum/application/use-cases/errors/not-allowed-error'
import { InMemoryQuestionAttachmentsRepository } from '../repositories/in-memory-question-attachments-repository'
import { makeQuestionAttachment } from '../factories/make-question-attachment'

let inMemoryRepository: InMemoryQuestionsRepository
let inMemoryAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let sut: DeleteQuestionUseCase

describe('Delete Question By Id', () => {
  beforeEach(() => {
    inMemoryAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    inMemoryRepository = new InMemoryQuestionsRepository(
      inMemoryAttachmentsRepository,
    )
    sut = new DeleteQuestionUseCase(inMemoryRepository)
  })

  it('should be able to delete a question by id', async () => {
    const newQuestion = makeQuestion(
      { authorId: new UniqueEntityID('some-author-id') },
      new UniqueEntityID('question-1'),
    )

    await inMemoryRepository.create(newQuestion)
    inMemoryAttachmentsRepository.items.push(
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityID('1'),
      }),
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityID('2'),
      }),
    )

    await sut.execute({
      authorId: 'some-author-id',
      questionId: 'question-1',
    })

    expect(inMemoryRepository.items).toHaveLength(0)
    expect(inMemoryAttachmentsRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a question with wrong author id', async () => {
    const newQuestion = makeQuestion(
      { authorId: new UniqueEntityID('some-author-id') },
      new UniqueEntityID('question-1'),
    )

    inMemoryRepository.create(newQuestion)

    const result = await sut.execute({
      authorId: 'wrong-author-id',
      questionId: 'question-1',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
