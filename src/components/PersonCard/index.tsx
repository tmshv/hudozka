import './styles.css'

import cx from 'classnames'
import { Image } from '../Image'

export const PersonCard = ({ picture, name, url, profile }) => (
    <div className={'personCard'}>
        <a className={'invisible'} href={url}>
            <div className={'personCard-Picture'}>
                <picture>
                    <img
                        className={cx({ opa: false })}
                        alt={''}
                        src={picture.src}
                        srcSet={picture.set.map(({ url, density }) => `${url} ${density}x`)}
                    />
                </picture>
            </div>

            <div className={'personCard-Title'}>
                {name[0]} {name[1]} {name[2]}
            </div>

            <div className={'personCard-Body'}>
                {profile.position}
            </div>
        </a>
    </div>
)
