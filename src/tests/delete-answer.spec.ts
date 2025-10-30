import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryAnswersRepository } from './repositories/in-memory-answers-repository'
import { DeleteAnswerUseCase } from '@/domain/forum/application/use-cases/delete-answer'
import { makeAnswer } from './factories/make-answer'

let inMemoryRepository: InMemoryAnswersRepository
let sut: DeleteAnswerUseCase

describe('Delete Answer By Id', () => {
  beforeEach(() => {
    inMemoryRepository = new InMemoryAnswersRepository()
    sut = new DeleteAnswerUseCase(inMemoryRepository)
  })
  it('should be able to delete an answer by id', async () => {
    const newAnswer = makeAnswer(
      { authorId: new UniqueEntityID('some-author-id') },
      new UniqueEntityID('answer-1'),
    )

    inMemoryRepository.create(newAnswer)

    await sut.execute({
      authorId: 'some-author-id',
      answerId: 'answer-1',
    })

    expect(inMemoryRepository.items).toHaveLength(0)
  })

  it('should not be able to delete an answer with wrong author id', async () => {
    const newAnswer = makeAnswer(
      { authorId: new UniqueEntityID('some-author-id') },
      new UniqueEntityID('answer-1'),
    )

    inMemoryRepository.create(newAnswer)

    await expect(() =>
      sut.execute({
        authorId: 'wrong-author-id',
        answerId: 'answer-1',
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
