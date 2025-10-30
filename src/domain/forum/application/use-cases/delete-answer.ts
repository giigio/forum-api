import { AnswersRepository } from '../repositories/answers-repository'

interface deleteAnswerUseCaseRequest {
  authorId: string
  answerId: string
}

interface deleteAnswerUseCaseResponse {}

export class DeleteAnswerUseCase {
  constructor(private answerRepository: AnswersRepository) {}

  async execute({
    authorId,
    answerId,
  }: deleteAnswerUseCaseRequest): Promise<deleteAnswerUseCaseResponse> {
    const answer = await this.answerRepository.findById(answerId)

    if (!answer) {
      throw new Error('Answer not found')
    }

    if (answer.authorId.toString() !== authorId) {
      throw new Error('You are not the author of this answer')
    }

    await this.answerRepository.delete(answer)

    return {}
  }
}
