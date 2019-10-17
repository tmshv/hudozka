import * as React from 'react'
import Share from '../Share'
import Html from '../Html'

export interface IPageProps {
    showSocialShare: boolean
}

export const Page: React.FC<IPageProps> = props => (
    <div className={'Article Article--cloud'}>
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
