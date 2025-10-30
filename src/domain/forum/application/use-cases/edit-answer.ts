import { Answer } from '../../enterprise/entities/answer'
import { AnswersRepository } from '../repositories/answers-repository'

interface editAnswerUseCaseRequest {
  authorId: string
  answerId: string
  content: string
}

interface editAnswerUseCaseResponse {
  answer: Answer
}

export class EditAnswerUseCase {
  constructor(private answerRepository: AnswersRepository) {}

  async execute({
    authorId,
    answerId,
    content,
  }: editAnswerUseCaseRequest): Promise<editAnswerUseCaseResponse> {
    const answer = await this.answerRepository.findById(answerId)

    if (!answer) {
      throw new Error('Answer not found.')
    }

    if (answer.authorId.toString() !== authorId) {
      throw new Error('You are not the author of this answer.')
    }

    answer.content = content

    await this.answerRepository.edit(answer)

    return { answer }
  }
}
