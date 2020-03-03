import { translit } from '../lib/translit'

export class Tag {
    public static fromCyrillic(tag: string) {
        const slug = tag
            ? translit(tag).toLowerCase()
            : tag

        return new Tag(tag, slug)
    }

    public name: string
    public slug: string

    constructor(name: string, slug: string) {
        this.name = name
        this.slug = slug
    }

    public isValid() {
        return !!this.slug
    }
}
