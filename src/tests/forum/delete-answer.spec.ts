import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryAnswersRepository } from '../repositories/in-memory-answers-repository'
import { DeleteAnswerUseCase } from '@/domain/forum/application/use-cases/delete-answer'
import { makeAnswer } from '../factories/make-answer'
import { NotAllowedError } from '@/domain/forum/application/use-cases/errors/not-allowed-error'
import { makeAnswerAttachment } from '../factories/make-answer-attachment'
import { InMemoryAnswerAttachmentsRepository } from '../repositories/in-memory-answer-attachment-repository'

let inMemoryRepository: InMemoryAnswersRepository
let inMemoryAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let sut: DeleteAnswerUseCase

describe('Delete Answer By Id', () => {
  beforeEach(() => {
    inMemoryAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    inMemoryRepository = new InMemoryAnswersRepository(
      inMemoryAttachmentsRepository,
    )
    sut = new DeleteAnswerUseCase(inMemoryRepository)
  })
  it('should be able to delete an answer by id', async () => {
    const newAnswer = makeAnswer(
      { authorId: new UniqueEntityID('some-author-id') },
      new UniqueEntityID('answer-1'),
    )

    inMemoryRepository.create(newAnswer)
    inMemoryAttachmentsRepository.items.push(
      makeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityID('1'),
      }),
      makeAnswerAttachment({
        answerId: newAnswer.id,
        attachmentId: new UniqueEntityID('2'),
      }),
    )

    await sut.execute({
      authorId: 'some-author-id',
      answerId: 'answer-1',
    })

    expect(inMemoryRepository.items).toHaveLength(0)
    expect(inMemoryAttachmentsRepository.items).toHaveLength(0)
  })

  it('should not be able to delete an answer with wrong author id', async () => {
    const newAnswer = makeAnswer(
      { authorId: new UniqueEntityID('some-author-id') },
      new UniqueEntityID('answer-1'),
    )

    inMemoryRepository.create(newAnswer)

    const result = await sut.execute({
      authorId: 'wrong-author-id',
      answerId: 'answer-1',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })
})
