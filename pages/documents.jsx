import React from 'react'
import axios from 'axios'
import Head from 'next/head'
import App from '../src/components/App'
import { Meta } from '../src/components/Meta'
import menuModel from '../src/models/menu'
import { buildMenu } from '../src/lib/menu'
import { meta } from '../src/lib/meta'

import DocumentList from '../src/components/DocumentList'
import ImageArtifactType from '../src/core/ImageArtifactType'
import { prioritySort } from '../src/lib/sort'
import { splitBy } from '../src/lib/array'
import { unique } from '../src/utils/common'

function getDocumentsMeta() {
    return {
        description: 'Документы Шлиссельбургской ДХШ',
    }
}

function getMeta(teacher) {
    return {
        title: teacher.name,
        description: teacher.name,
    }
}

function getSorted(documents) {
    const compose = (...fns) => value => fns
        .map(fn => fn)
        .reverse()
        .reduce((acc, fn) => fn(acc), value)

    const pass = fn => value => {
        fn(value)
        return value
    }

    const subtract = (a, b) => a - b

    const uniqueCategories = unique(i => i.category)

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

    const sortBy = fn => (a, b) => [a, b]
        .map(fn)
        .reduce(subtract)

    const getPriorityFn = (m, list) => value => list.includes(value)
        ? list.indexOf(value)
        : m

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

const Page = (props) => (
    <App
        menu={buildMenu(props.pageUrl, menuModel)}
        showAuthor={true}
        menuPadding={true}
    >
        <Head>
            <title>{props.title}</title>
            <Meta meta={props.meta} />
        </Head>

        <div className="content content_thin">
            {/* <pre>{JSON.stringify(props, null, 4)}</pre> */}
            
            {props.collections.map(({ name, items }, index) => (
                <DocumentList
                    key={index}
                    name={name}
                    documents={items}
                />
            ))}
        </div>
    </App>
)

Page.getInitialProps = async (ctx) => {
    const pageUrl = '/documents'
    const apiUrl = `http://localhost:3000/api/files`
    const res = await axios.get(apiUrl)
    const files = res.data.items
    const title = 'Документы'
    const collections = getSorted(files)

    return {
        collections,
        pageUrl,
        title,
        meta: meta({
            title,
            description: 'Документы Шлиссельбургской ДХШ',
        })
    }
}

export default Page