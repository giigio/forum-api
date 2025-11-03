import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryAnswersRepository } from '../repositories/in-memory-answers-repository'
import { EditAnswerUseCase } from '@/domain/forum/application/use-cases/edit-answer'
import { makeAnswer } from '../factories/make-answer'
import { NotAllowedError } from '@/domain/forum/application/use-cases/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/domain/forum/application/use-cases/errors/resource-not-found-error'
import { InMemoryAnswerAttachmentsRepository } from '../repositories/in-memory-answer-attachment-repository'
import { makeAnswerAttachment } from '../factories/make-answer-attachment'

let inMemoryRepository: InMemoryAnswersRepository
let inMemoryAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let sut: EditAnswerUseCase

describe('Edit Answer By Id', () => {
  beforeEach(() => {
    inMemoryAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    inMemoryRepository = new InMemoryAnswersRepository(
      inMemoryAttachmentsRepository,
    )
    sut = new EditAnswerUseCase(
      inMemoryRepository,
      inMemoryAttachmentsRepository,
    )
  })
  it('should be able to edit a answer by id', async () => {
    const newAnswer = makeAnswer(
      { authorId: new UniqueEntityID('some-author-id') },
      new UniqueEntityID('answer-1'),
    )

    await inMemoryRepository.create(newAnswer)
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
      answerId: newAnswer.id.toString(),
      content: 'New Content',
      attachmentsIds: ['1', '3'],
    })

    expect(inMemoryRepository.items[0]).toMatchObject({
      content: 'New Content',
    })
    expect(inMemoryRepository.items[0].attachments.currentItems).toHaveLength(2)
    expect(inMemoryRepository.items[0].attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityID('3') }),
    ])
  })

  it('should not be able to edit a answer with wrong author id', async () => {
    const newAnswer = makeAnswer(
      { authorId: new UniqueEntityID('some-author-id') },
      new UniqueEntityID('answer-1'),
    )

    inMemoryRepository.create(newAnswer)

    const result = await sut.execute({
      authorId: 'wrong-author-id',
      answerId: 'answer-1',
      content: 'New Content',
      attachmentsIds: ['1', '2'],
    })
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should not be able to edit a answer that does not exist', async () => {
    const newAnswer = makeAnswer(
      { authorId: new UniqueEntityID('some-author-id') },
      new UniqueEntityID('answer-1'),
    )

    inMemoryRepository.create(newAnswer)

    const result = await sut.execute({
      authorId: 'some-author-id',
      answerId: 'wrong-answer-id',
      content: 'New Content',
      attachmentsIds: ['1', '2'],
    })
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
