import { Question } from '../../enterprise/entities/question'
import { QuestionsRepository } from '../repositories/questions-repository'

interface editQuestionUseCaseRequest {
  authorId: string
  questionId: string
  title: string
  content: string
}

interface editQuestionUseCaseResponse {
  question: Question
}

export class EditQuestionUseCase {
  constructor(private questionRepository: QuestionsRepository) {}

  async execute({
    authorId,
    questionId,
    title,
    content,
  }: editQuestionUseCaseRequest): Promise<editQuestionUseCaseResponse> {
    const question = await this.questionRepository.findById(questionId)

    if (!question) {
      throw new Error('Question not found.')
    }

    if (question.authorId.toString() !== authorId) {
      throw new Error('You are not the author of this question.')
    }

    question.title = title
    question.content = content

    await this.questionRepository.edit(question)

    return { question }
  }
}
