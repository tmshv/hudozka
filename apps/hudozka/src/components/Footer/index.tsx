import s from "./footer.module.css"

export type FooterProps = {
    children?: React.ReactNode
}

export const Footer: React.FC<FooterProps> = ({ children }) => (
    <footer className={`${s.footer} opposite`}>
        {children}
    </footer>
)

