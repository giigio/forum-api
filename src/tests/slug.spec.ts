import { Slug } from '@/domain/forum/enterprise/entities/value-objects/slug'

describe('Slug Value Object', () => {
  it('should create a slug from text', () => {
    const text = 'Olá Mundo!-'
    const slug = Slug.createFromText(text)

    expect(slug.value).toEqual('ola-mundo')
  })
})
