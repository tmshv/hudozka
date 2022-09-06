import s from "./footer.module.css"

import cx from "classnames"
import { Copyright } from "../Copyright"
import { Author } from "./Author"
import { Block } from "../Block"
import { Spacer } from "../Spacer"
import { Contacts } from "../Contacts"

export type FooterProps = {
    showAuthor: boolean
    children?: React.ReactNode
}

export const Footer: React.FC<FooterProps> = props => (
    <footer className={cx(s.footer, "opposite")}>
        <Block direction={"vertical"} style={{
            marginBottom: "var(--size-l)",
        }}>
            <Contacts />
        </Block>

        {props.children}

        <Block direction={"horizontal"}>
            <Copyright />

            {!props.showAuthor ? null : (
                <>
                    <Spacer as={"span"} />
                    <Author />
                </>
            )}
        </Block>
    </footer >
)

