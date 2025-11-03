import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryAnswersRepository } from './repositories/in-memory-answers-repository'
import { EditAnswerUseCase } from '@/domain/forum/application/use-cases/edit-answer'
import { makeAnswer } from './factories/make-answer'
import { NotAllowedError } from '@/domain/forum/application/use-cases/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/domain/forum/application/use-cases/errors/resource-not-found-error'

let inMemoryRepository: InMemoryAnswersRepository
let sut: EditAnswerUseCase

describe('Edit Answer By Id', () => {
  beforeEach(() => {
    inMemoryRepository = new InMemoryAnswersRepository()
    sut = new EditAnswerUseCase(inMemoryRepository)
  })
  it('should be able to edit a answer by id', async () => {
    const newAnswer = makeAnswer(
      { authorId: new UniqueEntityID('some-author-id') },
      new UniqueEntityID('answer-1'),
    )

    inMemoryRepository.create(newAnswer)

    await sut.execute({
      authorId: 'some-author-id',
      answerId: newAnswer.id.toString(),
      content: 'New Content',
    })

    expect(inMemoryRepository.items[0]).toMatchObject({
      content: 'New Content',
    })
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
    })
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
