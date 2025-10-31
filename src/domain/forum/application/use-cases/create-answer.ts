import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Answer } from '../../enterprise/entities/answer'
import { AnswersRepository } from '../repositories/answers-repository'

interface CreateAnswerUseCaseRequest {
  authorId: string
  questionId: string
  content: string
}

interface CreateAnswerUseCaseResponse {
  answer: Answer
}

export class CreateAnswerUseCase {
  constructor(private answerRepository: AnswersRepository) {}

  async execute({
    authorId,
    questionId,
    content,
  }: CreateAnswerUseCaseRequest): Promise<CreateAnswerUseCaseResponse> {
    const answer = Answer.create({
      authorId: new UniqueEntityID(authorId),
      questionId: new UniqueEntityID(questionId),
      content,
    })

    await this.answerRepository.create(answer)

    return { answer }
  }
}
