import { InMemoryQuestionsRepository } from './repositories/in-memory-questions-repository'
import { makeQuestion } from './factories/make-question'
import { UniqueEntityID } from '@/core/entities/unique-entity-id'
import { EditQuestionUseCase } from '@/domain/forum/application/use-cases/edit-question'
import { NotAllowedError } from '@/domain/forum/application/use-cases/errors/not-allowed-error'
import { ResourceNotFoundError } from '@/domain/forum/application/use-cases/errors/resource-not-found-error'
import { InMemoryQuestionAttachmentsRepository } from './repositories/in-memory-question-attachments-repository'
import { makeQuestionAttachment } from './factories/make-question-attachment'

let inMemoryRepository: InMemoryQuestionsRepository
let inMemoryAttachmentsRepository: InMemoryQuestionAttachmentsRepository
let sut: EditQuestionUseCase

describe('Edit Question By Id', () => {
  beforeEach(() => {
    inMemoryAttachmentsRepository = new InMemoryQuestionAttachmentsRepository()
    inMemoryRepository = new InMemoryQuestionsRepository(
      inMemoryAttachmentsRepository,
    )

    sut = new EditQuestionUseCase(
      inMemoryRepository,
      inMemoryAttachmentsRepository,
    )
  })
  it('should be able to edit a question by id', async () => {
    const newQuestion = makeQuestion(
      { authorId: new UniqueEntityID('some-author-id') },
      new UniqueEntityID('question-1'),
    )

    await inMemoryRepository.create(newQuestion)
    inMemoryAttachmentsRepository.items.push(
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityID('1'),
      }),
      makeQuestionAttachment({
        questionId: newQuestion.id,
        attachmentId: new UniqueEntityID('2'),
      }),
    )

    await sut.execute({
      authorId: 'some-author-id',
      questionId: newQuestion.id.toString(),
      title: 'New Title',
      content: 'New Content',
      attachmentsIds: ['1', '3'],
    })

    expect(inMemoryRepository.items[0]).toMatchObject({
      title: 'New Title',
      content: 'New Content',
    })
    expect(inMemoryRepository.items[0].attachments.currentItems).toHaveLength(2)
    expect(inMemoryRepository.items[0].attachments.currentItems).toEqual([
      expect.objectContaining({ attachmentId: new UniqueEntityID('1') }),
      expect.objectContaining({ attachmentId: new UniqueEntityID('3') }),
    ])
  })

  it('should not be able to edit a question with wrong author id', async () => {
    const newQuestion = makeQuestion(
      { authorId: new UniqueEntityID('some-author-id') },
      new UniqueEntityID('question-1'),
    )

    inMemoryRepository.create(newQuestion)

    const result = await sut.execute({
      authorId: 'wrong-author-id',
      questionId: 'question-1',
      title: 'New Title',
      content: 'New Content',
      attachmentsIds: ['1', '2', '3'],
    })
    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should not be able to edit a question that does not exist', async () => {
    const newQuestion = makeQuestion(
      { authorId: new UniqueEntityID('some-author-id') },
      new UniqueEntityID('question-1'),
    )

    inMemoryRepository.create(newQuestion)

    const result = await sut.execute({
      authorId: 'some-author-id',
      questionId: 'wrong-question-id',
      title: 'New Title',
      content: 'New Content',
      attachmentsIds: ['1', '2', '3'],
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(ResourceNotFoundError)
  })
})
