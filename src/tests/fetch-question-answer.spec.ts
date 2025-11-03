import { FetchQuestionAnswersUseCase } from '@/domain/forum/application/use-cases/fetch-question-answers'
import { InMemoryAnswersRepository } from './repositories/in-memory-answers-repository'
import { makeAnswer } from './factories/make-answer'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { InMemoryAnswerAttachmentsRepository } from './repositories/in-memory-answer-attachment-repository'

let inMemoryAttachmentsRepository: InMemoryAnswerAttachmentsRepository
let inMemoryRepository: InMemoryAnswersRepository
let sut: FetchQuestionAnswersUseCase

describe('Fetch Question Answers', () => {
  beforeEach(() => {
    inMemoryAttachmentsRepository = new InMemoryAnswerAttachmentsRepository()
    inMemoryRepository = new InMemoryAnswersRepository(
      inMemoryAttachmentsRepository,
    )
    sut = new FetchQuestionAnswersUseCase(inMemoryRepository)
  })
  it('should be able to fetch all question answers from a specific question', async () => {
    await inMemoryRepository.create(
      makeAnswer({ questionId: new UniqueEntityID('question-1') }),
    )
    await inMemoryRepository.create(
      makeAnswer({ questionId: new UniqueEntityID('question-1') }),
    )
    await inMemoryRepository.create(
      makeAnswer({ questionId: new UniqueEntityID('question-2') }),
    )

    const result = await sut.execute({
      questionId: 'question-1',
      page: 1,
    })

    expect(result.value?.answers).toHaveLength(2)
    expect(result.value?.answers[0].questionId).toEqual(
      new UniqueEntityID('question-1'),
    )
  })

  it('should be able to fetch paginated question answers', async () => {
    for (let i = 1; i <= 22; i++) {
      await inMemoryRepository.create(
        makeAnswer({ questionId: new UniqueEntityID('question-1') }),
      )
    }

    const result = await sut.execute({
      questionId: 'question-1',
      page: 2,
    })

    expect(result.value?.answers).toHaveLength(2)
  })
})
