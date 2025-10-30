import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Answer } from '../../enterprise/entities/answer'
import { AnswersRepository } from '../repositories/answers-repository'

interface createAnswerUseCaseRequest {
  authorId: string
  questionId: string
  content: string
}

interface createAnswerUseCaseResponse {
  answer: Answer
}

export class CreateAnswerUseCase {
  constructor(private answerRepository: AnswersRepository) {}

  async execute({
    authorId,
    questionId,
    content,
  }: createAnswerUseCaseRequest): Promise<createAnswerUseCaseResponse> {
    const answer = Answer.create({
      authorId: new UniqueEntityID(authorId),
      questionId: new UniqueEntityID(questionId),
      content,
    })

    await this.answerRepository.create(answer)

    return { answer }
  }
}
