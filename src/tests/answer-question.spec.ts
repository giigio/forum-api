import { AnswerQuestionUseCase } from '@/domain/use-cases/answer-question'
import { AnswersRepository } from '@/domain/repositories/answers-repository'
import { Answer } from '@/domain/entities/answer'

describe('Answer Question Use Case', () => {
  it('should be able to answer a question', async () => {
    const fakeAnswersRepository: AnswersRepository = {
      create: async (answer: Answer) => {
        // Simula a criação da resposta
      },
    }

    const answerQuestion = new AnswerQuestionUseCase(fakeAnswersRepository)

    const answer = await answerQuestion.execute({
      questionId: 'question-1',
      instructorId: 'instructor-1',
      content: 'This is an answer to the question.',
    })

    expect(answer.content).toEqual('This is an answer to the question.')
  })
})
