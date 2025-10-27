/**
 * Make some properties of T optional
 *
 * @example
 *  ```typescript
 * type Post = {
 *   id: string;
 *   title: string;
 *  content: string;
 * }
 *
 * Option<Post, 'id' | 'content'>
 * ```
 */

export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>
