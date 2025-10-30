import { InMemoryQuestionsRepository } from './repositories/in-memory-questions-repository'
import { makeQuestion } from './factories/make-question'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { EditQuestionUseCase } from '@/domain/forum/application/use-cases/edit-question'

let inMemoryRepository: InMemoryQuestionsRepository
let sut: EditQuestionUseCase

describe('Edit Question By Id', () => {
  beforeEach(() => {
    inMemoryRepository = new InMemoryQuestionsRepository()
    sut = new EditQuestionUseCase(inMemoryRepository)
  })
  it('should be able to edit a question by id', async () => {
    const newQuestion = makeQuestion(
      { authorId: new UniqueEntityID('some-author-id') },
      new UniqueEntityID('question-1'),
    )

    inMemoryRepository.create(newQuestion)

    await sut.execute({
      authorId: 'some-author-id',
      questionId: newQuestion.id.toString(),
      title: 'New Title',
      content: 'New Content',
    })

    expect(inMemoryRepository.items[0]).toMatchObject({
      title: 'New Title',
      content: 'New Content',
    })
  })

  it('should not be able to edit a question with wrong author id', async () => {
    const newQuestion = makeQuestion(
      { authorId: new UniqueEntityID('some-author-id') },
      new UniqueEntityID('question-1'),
    )

    inMemoryRepository.create(newQuestion)

    await expect(() =>
      sut.execute({
        authorId: 'wrong-author-id',
        questionId: 'question-1',
        title: 'New Title',
        content: 'New Content',
      }),
    ).rejects.toBeInstanceOf(Error)
  })

  it('should not be able to edit a question that does not exist', async () => {
    const newQuestion = makeQuestion(
      { authorId: new UniqueEntityID('some-author-id') },
      new UniqueEntityID('question-1'),
    )

    inMemoryRepository.create(newQuestion)

    await expect(() =>
      sut.execute({
        authorId: 'some-author-id',
        questionId: 'wrong-question-id',
        title: 'New Title',
        content: 'New Content',
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
