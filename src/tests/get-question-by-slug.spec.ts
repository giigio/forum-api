import { Question } from '@/domain/forum/enterprise/entities/question'
import { InMemoryQuestionsRepository } from './repositories/in-memory-questions-repository'
import { GetQuestionBySlugUseCase } from '@/domain/forum/application/use-cases/get-question-by-slug'
import { makeQuestion } from './factories/make-question'
import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'

let inMemoryRepository: InMemoryQuestionsRepository
let sut: GetQuestionBySlugUseCase

describe('Get Question By Slug', () => {
  beforeEach(() => {
    inMemoryRepository = new InMemoryQuestionsRepository()
    sut = new GetQuestionBySlugUseCase(inMemoryRepository)
  })
  it('should be able to get a question by slug', async () => {
    const newQuestion = makeQuestion({
      slug: Slug.create('example-question'),
    })

    inMemoryRepository.create(newQuestion)

    const { question } = await sut.execute({
      slug: 'example-question',
    })

    expect(question.title).toEqual(newQuestion.title)
  })
})
