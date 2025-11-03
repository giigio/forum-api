import { WatchedList } from '@/core/entities/watched-list'

class StubWatchedList extends WatchedList<number> {
  compareItems(a: number, b: number): boolean {
    return a === b
  }
}

describe('Watched List', () => {
  it('should be able to create a new watched list', () => {
    const watchedList = new StubWatchedList([1, 2, 3])

    expect(watchedList.getItems()).toHaveLength(3)
  })
  it('should be able to track new items', () => {
    const watchedList = new StubWatchedList([1, 2, 3])

    watchedList.add(4)

    expect(watchedList.getItems()).toHaveLength(4)
    expect(watchedList.getNewItems()).toEqual([4])
  })
  it('should be able to track removed items', () => {
    const watchedList = new StubWatchedList([1, 2, 3])

    watchedList.remove(2)

    expect(watchedList.getItems()).toHaveLength(2)
    expect(watchedList.getRemovedItems()).toEqual([2])
  })
  it('should be able to add an item that was removed before', () => {
    const watchedList = new StubWatchedList([1, 2, 3])

    watchedList.remove(2)
    watchedList.add(2)

    expect(watchedList.getItems()).toHaveLength(3)
    expect(watchedList.getRemovedItems()).toEqual([])
    expect(watchedList.getNewItems()).toEqual([])
  })
  it('should be able to remove an item that was added before', () => {
    const watchedList = new StubWatchedList([1, 2, 3])

    watchedList.add(4)
    watchedList.remove(4)

    expect(watchedList.getItems()).toHaveLength(3)
    expect(watchedList.getNewItems()).toEqual([])
  })

  it('should be able to update watched list items', () => {
    const watchedList = new StubWatchedList([1, 2, 3])

    watchedList.update([1, 3, 5])

    expect(watchedList.getRemovedItems()).toEqual([2])
    expect(watchedList.getNewItems()).toEqual([5])
  })
})
