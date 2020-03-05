import cx from 'classnames'

export type WrapperProps = {
    header: React.ReactNode
    footer: React.ReactNode
    style?: React.CSSProperties
    mainStyle?: React.CSSProperties
}

export const Wrapper: React.FC<WrapperProps> = props => (
    <div className={cx('wrapper', 'theme-default')} style={props.style}>
        <style jsx>{`
            .wrapper {
                display: flex;
                flex-direction: column;
                min-height: 100vh;
                background-color: var(--color-back-main);

                font-family: var(--text-font);
                font-size: var(--font-size-default);
            }
        `}</style>

        {props.header}

        <main style={props.mainStyle}>
            {props.children}
        </main>

        {props.footer}
    </div>
)
