import { AnswerQuestionUseCase } from '@/domain/forum/application/use-cases/answer-question'
import { InMemoryAnswersRepository } from './repositories/in-memory-answers-repository'

let inMemoryRepository: InMemoryAnswersRepository
let sut: AnswerQuestionUseCase

describe('Answer Question Use Case', () => {
  beforeEach(() => {
    inMemoryRepository = new InMemoryAnswersRepository()
    sut = new AnswerQuestionUseCase(inMemoryRepository)
  })

  it('should be able to answer a question', async () => {
    const { answer } = await sut.execute({
      questionId: 'question-1',
      instructorId: 'instructor-1',
      content: 'This is an answer to the question.',
    })

    expect(answer.id).toBeTruthy()
    expect(inMemoryRepository.items[0].content).toEqual(
      'This is an answer to the question.',
    )
  })
})
