import { QuestionsRepository } from '@/domain/forum/application/repositories/questions-repository'
import { Question } from '@/domain/forum/enterprise/entities/question'

export class InMemoryQuestionsRepository implements QuestionsRepository {
  public items: Question[] = []

  async findById(id: string) {
    const question = this.items.find((item) => item.id.toString() === id)
    if (!question) {
      return null
    }
    return question
  }

  async findBySlug(slug: string) {
    const question = this.items.find((item) => item.slug.value === slug)
    if (!question) {
      return null
    }
    return question
  }

  async findManyRecent(page: number) {
    return this.items.slice((page - 1) * 20, page * 20)
  }

  async create(question: Question) {
    this.items.push(question)
  }

  async delete(question: Question) {
    const index = this.items.findIndex((item) => item.id === question.id)
    if (index >= 0) {
      this.items.splice(index, 1)
    }
  }

  async edit(question: Question) {
    const index = this.items.findIndex((item) => item.id === question.id)
    if (index >= 0) {
      this.items[index] = question
    }
  }
}
