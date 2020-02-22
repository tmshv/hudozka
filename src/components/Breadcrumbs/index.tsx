import './styles.css'

import { IBreadcumbsPart } from 'src/types'
import { Button } from '../Button'

export type BreadcrumbsProps = {
    style?: React.CSSProperties
    path: IBreadcumbsPart[]
}

export const Breadcrumbs: React.FC<BreadcrumbsProps> = props => {
    return (
        <nav className={'breadcrumbs'} style={props.style}>
            {props.path.map((x, i) => (
                <li key={x.href}>
                    <Button
                        href={x.href}
                        theme={'ghost'}
                        size={'small'}
                    >
                        {x.name}
                    </Button>

                    {!(i < props.path.length - 1) ? null : (
                        <span style={{ margin: '0 var(--size-xs)' }}>/</span>
                    )}
                </li>
            ))}
        </nav>
    )
}
