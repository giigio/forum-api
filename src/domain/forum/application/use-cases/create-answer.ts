import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { Answer } from '../../enterprise/entities/answer'
import { AnswersRepository } from '../repositories/answers-repository'
import { Either, right } from '@/core/either'

interface CreateAnswerUseCaseRequest {
  authorId: string
  questionId: string
  content: string
}

type CreateAnswerUseCaseResponse = Either<
  null,
  {
    answer: Answer
  }
>

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

    return right({ answer })
  }
}
