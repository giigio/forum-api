import { CreateQuestionUseCase } from '@/domain/forum/application/use-cases/create-question'
import { InMemoryQuestionsRepository } from './repositories/in-memory-questions-repository'

let inMemoryRepository: InMemoryQuestionsRepository
let sut: CreateQuestionUseCase

describe('Create Question Use Case', () => {
  beforeEach(() => {
    inMemoryRepository = new InMemoryQuestionsRepository()
    sut = new CreateQuestionUseCase(inMemoryRepository)
  })
  it('should be able to create a question', async () => {
    const result = await sut.execute({
      authorId: 'author-1',
      title: 'How to learn TypeScript?',
      content: 'This is an question.',
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryRepository.items[0]).toEqual(result.value?.question)
  })
})
