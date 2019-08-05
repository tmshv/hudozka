import React from 'react'
import { Image } from './Image'

module.exports = ({ picture, name, url, profile }) => (
    <div className="PersonCard">
        <style jsx>{`
            .PersonCard {
                --person-card-width: 30%;
                --person-card-height: 24em;

                display: flex;
                flex-direction: column;

                margin-bottom: var(--double-margin);

                width: var(--person-card-width);
                min-width: 10em;
                max-width: 30em;
            }

            .PersonCard > a {
                display: block;
                position: relative;
            }

            .PersonCard-Picture {
                position: relative;
                border-radius: 10px;

                width: 100%;
                height: var(--person-card-height);

                overflow: hidden;
            }

            .PersonCard-Picture img {
                position: absolute;
                width: 100%;
                height: 100%;
                top: 0;
                left: 0;

                object-fit: cover;
                transition: all 150ms ease-out;
                //transform: scale(1.05);
            }

            .PersonCard-Title, .PersonCard-Body  {
                position: absolute;
                width: 100%;
                padding: var(--single-margin);
                box-sizing: border-box;
                color: white;
                text-align: center;
                text-shadow: 0 0 3px #000;
            }

            .PersonCard-Title {
                top: 0;
            }

            .PersonCard-Body {
                bottom: 0;
            }

            .PersonCard:hover img {
                //transform: scale(1.05);
                width: 105%;
                height: 105%;
                top: -2.5%;
                left: -2.5%;
            }


            // Tablet

            @media screen and (min-width: var(--tablet-min-width)) and (max-width: var(--tablet-max-width)) {
                .PersonCard {
                    --person-card-height: 20em;
                }

                @media screen and (orientation: portrait) {
                }
            }


            // Mobile

            @media (max-width: var(--mobile-width)) {
                .PersonCard {
                    --person-card-width: 100%;
                }
            }
        `}</style>

        <a className="invisible" href={url}>
            <div className="PersonCard-Picture">
                <Image
                    data={picture}
                    opa={false}
                />
            </div>

            <div className="PersonCard-Title">
                {name[0]} {name[1]} {name[2]}
            </div>

            <div className="PersonCard-Body">
                {profile.position}
            </div>
        </a>
    </div>
)
