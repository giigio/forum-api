import { Question } from '../../enterprise/entities/question'

export interface QuestionsRepository {
  findById(id: string): Promise<Question | null>
  findBySlug(slug: string): Promise<Question | null>
  findManyRecent(page: number): Promise<Question[]>
  create(question: Question): Promise<void>
  delete(question: Question): Promise<void>
  edit(question: Question): Promise<void>
}
