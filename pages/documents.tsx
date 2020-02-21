import Head from 'next/head'
import { App } from 'src/components/App'
import { Meta } from 'src/components/Meta'
import menuModel from 'src/models/menu'
import { buildMenu } from 'src/lib/menu'
import { meta } from 'src/lib/meta'
import { IDocument } from 'src/types'
import { DocumentList } from 'src/components/DocumentList'
import { unique } from 'src/utils/common'
import { createApiUrl, requestGet, IResponseItems } from 'src/next-lib'
import { NextPage } from 'next'

interface IDocumentCategory {
    name: string
    items: IDocument[]
}

function getSorted(documents: IDocument[]): IDocumentCategory[] {
    const compose = (...fns) => value => fns
        .map(fn => fn)
        .reverse()
        .reduce((acc, fn) => fn(acc), value)

    const pass = fn => value => {
        fn(value)
        return value
    }

    const subtract = (a, b) => a - b

    const uniqueCategories = unique<IDocument, string>(i => i.category)

    const priority = {
        'Основные документы': [
            'https://static.shlisselburg.org/art/uploads/ustav-2015.pdf',
            'https://static.shlisselburg.org/art/uploads/obrazovatelnaia-litsenziia-2015.pdf',
            'https://static.shlisselburg.org/art/uploads/svidetelstvo-na-pomeshchenie.pdf',
            'https://static.shlisselburg.org/art/uploads/egriul.pdf',
            'https://static.shlisselburg.org/art/uploads/inn.pdf',
            'https://static.shlisselburg.org/art/uploads/reshenie-o-sozdanii-shkoly.pdf',
            'https://static.shlisselburg.org/art/uploads/kopiia-resheniia-o-naznachenii-rukovoditelia.pdf',
            'https://static.shlisselburg.org/art/uploads/postanovlenie-o-sozdanii-munitsipalnogo-obrazovatelnogo-uchrezhdeniia-kultury-detskaia-khudozhestvennaia-shkola.pdf',
        ],
        'Учебные программы': [
            'https://static.shlisselburg.org/art/uploads/uchebnaia-programma-zhivopis.pdf',
        ]
    }

    const CATEGORY_PRIORITY = [
        'Основные документы',
        'Планы ФХД',
        'Самообследование деятельности',
        'Инструкции',
        'Образование',
        'Учебные программы',
        'Платные образовательные услуги',
        'Дополнительные общеразвивающие программы',
        'Документы для поступления',
    ]

    function sortBy<T>(fn: (value: T) => number): (a: T, b: T) => number {
        return (a, b) => [a, b].map(fn).reduce(subtract)
    }

    function getPriorityFn<T>(m: number, list: T[]): (value: T) => number {
        return (value: T) => {
            const has = list.includes(value)
            return has ? list.indexOf(value) : m
        }
    }

    const safeSelect = (d, store, key) => key in store
        ? store[key]
        : d

    const categoryPriority = getPriorityFn(10000, CATEGORY_PRIORITY)

    const documentPriority = ({ category, fileUrl }) => compose(
        getPriorityFn.bind(null, 10000),
        safeSelect.bind(null, [], priority)
    )(category)(fileUrl)

    const documentsOf = category => documents.filter(i => i.category === category)
    const sorted = documents => documents.sort(sortBy(documentPriority))
    const collectDocumentsByCategory = compose(sorted, documentsOf)

    return uniqueCategories(documents)
        .sort(sortBy(categoryPriority))
        .reduce((acc, name) => [...acc, {
            name,
            items: collectDocumentsByCategory(name)
        }], [])
}

interface IProps {
    collections: IDocumentCategory[]
    pageUrl: string
    title: string
    meta: any
}

const Page: NextPage<IProps> = props => (
    <App
        menu={buildMenu(props.pageUrl, menuModel)}
        showAuthor={true}
        layout={'wide'}
    >
        <Head>
            <title>{props.title}</title>
            <Meta meta={props.meta} />
        </Head>

        <h1>{props.title}</h1>

        {props.collections.map((collection, index) => (
            <DocumentList
                key={index}
                name={collection.name}
                documents={collection.items}
            />
        ))}
    </App>
)

export const unstable_getStaticProps = async (ctx) => {
    const pageUrl = '/documents'
    const res = await requestGet<IResponseItems<IDocument>>(createApiUrl('/api/files'), { items: [] })
    const files = res.items
    const title = 'Документы'
    const collections = getSorted(files)

    return {
        props: {
            collections,
            pageUrl,
            title,
            meta: meta({
                title,
                description: 'Документы Шлиссельбургской ДХШ',
            })
        }
    }
}

export default Page
