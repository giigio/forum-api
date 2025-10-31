import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { AnswersRepository } from '../repositories/answers-repository'
import { Question } from '../../enterprise/entities/question'
import { QuestionsRepository } from '../repositories/questions-repository'

interface chooseQuestionBestAnswerUseCaseRequest {
  authorId: string
  answerId: string
}

interface chooseQuestionBestAnswerUseCaseResponse {
  question: Question
}

export class ChooseQuestionBestAnswerUseCase {
  constructor(
    private answerRepository: AnswersRepository,
    private questionRepository: QuestionsRepository,
  ) {}

  async execute({
    authorId,
    answerId,
  }: chooseQuestionBestAnswerUseCaseRequest): Promise<chooseQuestionBestAnswerUseCaseResponse> {
    const answer = await this.answerRepository.findById(answerId)

    if (!answer) {
      throw new Error('Answer not found.')
    }

    const question = await this.questionRepository.findById(
      answer.questionId.toString(),
    )

    if (!question) {
      throw new Error('Question not found.')
    }

    if (question.authorId.toString() !== authorId) {
      throw new Error('You are not the author of this question.')
    }

    question.bestAnswerId = answer.id

    await this.questionRepository.edit(question)

    return { question }
  }
}
