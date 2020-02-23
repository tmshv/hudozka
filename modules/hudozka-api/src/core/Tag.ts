import { translit } from '../lib/translit'

export class Tag {
    public name: string
    public slug: string

    constructor(tag: string) {
        this.name = tag

        if (tag) {
            this.slug = translit(tag).toLowerCase()
        }
    }

    public isValid() {
        return !!this.slug
    }
}
