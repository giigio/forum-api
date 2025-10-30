import { QuestionsRepository } from '../repositories/questions-repository'

interface deleteQuestionUseCaseRequest {
  authorId: string
  questionId: string
}

interface deleteQuestionUseCaseResponse {}

export class DeleteQuestionUseCase {
  constructor(private questionRepository: QuestionsRepository) {}

  async execute({
    authorId,
    questionId,
  }: deleteQuestionUseCaseRequest): Promise<deleteQuestionUseCaseResponse> {
    const question = await this.questionRepository.findById(questionId)

    if (!question) {
      throw new Error('Question not found')
    }

    if (question.authorId.toString() !== authorId) {
      throw new Error('You are not the author of this question')
    }

    await this.questionRepository.delete(question)

    return {}
  }
}
