import { AnswersRepository } from '@/domain/forum/application/repositories/answers-repository'
import { Answer } from '@/domain/forum/enterprise/entities/answer'

export class InMemoryAnswersRepository implements AnswersRepository {
  public items: Answer[] = []
  async findById(id: string) {
    const answer = this.items.find((item) => item.id.toString() === id)
    if (!answer) {
      return null
    }
    return answer
  }

  async delete(answer: Answer) {
    const index = this.items.findIndex((item) => item.id === answer.id)
    if (index >= 0) {
      this.items.splice(index, 1)
    }
  }

  async create(answer: Answer) {
    this.items.push(answer)
  }

  async edit(answer: Answer) {
    const index = this.items.findIndex((item) => item.id === answer.id)
    if (index >= 0) {
      this.items[index] = answer
    }
  }
}
