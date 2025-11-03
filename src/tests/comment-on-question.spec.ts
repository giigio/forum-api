import { makeQuestion } from './factories/make-question'
import { InMemoryQuestionsRepository } from './repositories/in-memory-questions-repository'
import { InMemoryQuestionCommentsRepository } from './repositories/in-memory-comment-on-question'
import { CommentOnQuestionUseCase } from '@/domain/forum/application/use-cases/comment-on-question'
import { InMemoryQuestionAttachmentsRepository } from './repositories/in-memory-question-attachments-repository'

let inMemoryQuestionRepository: InMemoryQuestionsRepository
let inMemoryAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let inMemoryQuestionCommentsRepository: InMemoryQuestionCommentsRepository
let sut: CommentOnQuestionUseCase

describe('Comment On Question Use Case', () => {
  beforeEach(() => {
    inMemoryAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    inMemoryQuestionRepository = new InMemoryQuestionsRepository(
      inMemoryAttachmentsRepository,
    )
    inMemoryQuestionCommentsRepository =
      new InMemoryQuestionCommentsRepository()
    sut = new CommentOnQuestionUseCase(
      inMemoryQuestionRepository,
      inMemoryQuestionCommentsRepository,
    )
  })

  it('should be able to comment on question', async () => {
    const question = makeQuestion()

    await inMemoryQuestionRepository.create(question)

    await sut.execute({
      questionId: question.id.toString(),
      authorId: question.authorId.toString(),
      content: 'Test comment',
    })

    expect(inMemoryQuestionCommentsRepository.items[0].content).toEqual(
      'Test comment',
    )
  })
})
