export class Slug {
  public value: string

  private constructor(value: string) {
    this.value = value
  }

  static create(slug: string) {
    return new Slug(slug)
  }

  /**
   * Receives a text and normalizes it to create a slug value.
   *
   * Example: "Olá Mundo!" => "ola-mundo"
   *
   * @param text {string}
   * @returns
   */

  static createFromText(text: string) {
    const slugValue = text
      .normalize('NFKD')
      .toLocaleLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]+/g, '')
      .replace(/_/g, '-')
      .replace(/--+/g, '-')
      .replace(/^-|-$/g, '')

    return new Slug(slugValue)
  }
}
