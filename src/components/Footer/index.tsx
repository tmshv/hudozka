import s from "./footer.module.css"

import cx from "classnames"
import { Copyright } from "../Copyright"
import { Author } from "./Author"
import { Spacer } from "../Spacer"
import { Contacts } from "../Contacts"
import { Box } from "@/ui/Box"

export type FooterProps = {
    showAuthor: boolean
    children?: React.ReactNode
}

export const Footer: React.FC<FooterProps> = ({ showAuthor, children }) => (
    <footer className={cx(s.footer, "opposite")}>
        <Box vertical align={false} style={{
            marginBottom: "var(--size-l)",
        }}>
            <Contacts />
        </Box>

        {children}

        <Box>
            <Copyright />

            {!showAuthor ? null : (
                <>
                    <Spacer as={"span"} />
                    <Author />
                </>
            )}
        </Box>
    </footer >
)

