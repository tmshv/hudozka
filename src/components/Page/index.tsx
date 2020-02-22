import { Share } from '../Share'
import { Html } from '../Html'

export interface IPageProps {
    showSocialShare: boolean
    children: string
}

export const Page: React.FC<IPageProps> = props => (
    <div className={'Article'}>
        <div className={'Article-Body'}>
            <Html
                html={props.children}
            />
        </div>

        {!props.showSocialShare ? null : (
            <Share />
        )}
    </div>
)
