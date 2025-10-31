import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { makeAnswer } from './factories/make-answer'
import { makeQuestion } from './factories/make-question'
import { InMemoryAnswersRepository } from './repositories/in-memory-answers-repository'
import { InMemoryQuestionsRepository } from './repositories/in-memory-questions-repository'
import { ChooseQuestionBestAnswerUseCase } from '@/domain/forum/application/use-cases/choose-question-best-answer'

let inMemoryQuestionRepository: InMemoryQuestionsRepository
let inMemoryAnswerRepository: InMemoryAnswersRepository
let sut: ChooseQuestionBestAnswerUseCase

describe('Choose Question Best Answer Use Case', () => {
  beforeEach(() => {
    inMemoryQuestionRepository = new InMemoryQuestionsRepository()
    inMemoryAnswerRepository = new InMemoryAnswersRepository()
    sut = new ChooseQuestionBestAnswerUseCase(
      inMemoryAnswerRepository,
      inMemoryQuestionRepository,
    )
  })

  it('should be able to choose a best answer for a question', async () => {
    const question = makeQuestion()
    const answer = makeAnswer({ questionId: question.id })

    await inMemoryQuestionRepository.create(question)
    await inMemoryAnswerRepository.create(answer)

    await sut.execute({
      authorId: question.authorId.toString(),
      answerId: answer.id.toString(),
    })

    expect(inMemoryQuestionRepository.items[0].bestAnswerId).toEqual(answer.id)
  })

  it('should not be able to choose a best answer for a question from another author', async () => {
    const question = makeQuestion({ authorId: new UniqueEntityID('author-1') })
    const answer = makeAnswer({ questionId: question.id })

    await inMemoryQuestionRepository.create(question)
    await inMemoryAnswerRepository.create(answer)

    await expect(() =>
      sut.execute({
        authorId: 'wrong-author-id',
        answerId: answer.id.toString(),
      }),
    ).rejects.toBeInstanceOf(Error)
  })
})
