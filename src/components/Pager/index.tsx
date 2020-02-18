import { Block } from '../Block'
import { Button } from '../Button'
import { Spacer } from '../Spacer'

export type PagerProps = {
    nextHref: string | null
    prevHref: string | null
}

export const Pager: React.FC<PagerProps> = props => (
    <Block direction={'horizontal'}>
        {!props.prevHref ? null : (
            <Button href={props.prevHref}>Предыдущая страница</Button>
        )}
        <Spacer />
        {!props.nextHref ? null : (
            <Button href={props.nextHref}>Следущая страница</Button>
        )}
    </Block>
)
