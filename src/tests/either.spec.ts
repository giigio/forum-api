import { Either, left, right } from '@/core/either'

function testEither(x: boolean): Either<string, number> {
  if (x) {
    return right(10)
  } else {
    return left('error')
  }
}

test('success result', () => {
  const result = testEither(true)

  if (result.isRight()) {
    expect(result.value).toEqual(10)
  }

  expect(result.isRight()).toBe(true)
  expect(result.isLeft()).toBe(false)
})

test('error result', () => {
  const result = testEither(false)

  if (result.isLeft()) {
    expect(result.value).toEqual('error')
  }

  expect(result.isLeft()).toBe(true)
  expect(result.isRight()).toBe(false)
})
