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
    const { question } = await sut.execute({
      authorId: 'author-1',
      title: 'How to learn TypeScript?',
      content: 'This is an question.',
    })

    expect(question.id).toBeTruthy()
    expect(inMemoryRepository.items[0].content).toEqual('This is an question.')
  })
})
