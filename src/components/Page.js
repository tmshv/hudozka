import React from 'react'
import Share from './Share'
import Html from './Html'

export default function Page({ children, shareable }) {
    return (
        <div className={'Article Article--cloud'}>
            <div className={'Article-Body'}>                
                <Html
                    html={children}
                />
            </div>

            {!shareable ? null : (
                <Share />
            )}
        </div>
    )
}
