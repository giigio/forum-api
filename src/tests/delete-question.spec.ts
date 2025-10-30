import { InMemoryQuestionsRepository } from './repositories/in-memory-questions-repository'
import { makeQuestion } from './factories/make-question'
import { DeleteQuestionUseCase } from '@/domain/forum/application/use-cases/delete-question'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'

let inMemoryRepository: InMemoryQuestionsRepository
let sut: DeleteQuestionUseCase

describe('Delete Question By Id', () => {
  beforeEach(() => {
    inMemoryRepository = new InMemoryQuestionsRepository()
    sut = new DeleteQuestionUseCase(inMemoryRepository)
  })
  it('should be able to delete a question by id', async () => {
    const newQuestion = makeQuestion(
      { authorId: new UniqueEntityID('some-author-id') },
      new UniqueEntityID('question-1'),
    )

    inMemoryRepository.create(newQuestion)

    await sut.execute({
      authorId: 'some-author-id',
      questionId: 'question-1',
    })

    expect(inMemoryRepository.items).toHaveLength(0)
  })

  it('should not be able to delete a question with wrong author id', async () => {
    const newQuestion = makeQuestion(
      { authorId: new UniqueEntityID('some-author-id') },
      new UniqueEntityID('question-1'),
    )

    inMemoryRepository.create(newQuestion)

    await expect(() =>
      sut.execute({
        authorId: 'wrong-author-id',
        questionId: 'question-1',
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
