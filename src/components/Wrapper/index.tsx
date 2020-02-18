import cx from 'classnames'

export type WrapperProps = {
    header: React.ReactNode
    footer: React.ReactNode
}

export const Wrapper: React.FC<WrapperProps> = props => (
    <div className={cx('wrapper', 'theme-default')}>
        <style jsx>{`
            .wrapper {
                display: flex;
                flex-direction: column;
                min-height: 100vh;
                background-color: white;

                font-family: var(--text-font);
                font-size: var(--font-size-default);
            }

            .content {
                flex: 1;
            }

            main {
                display: flex;
                justify-content: center;
            }
        `}</style>

        {props.header}

        <main> 
            {props.children}
        </main>

        {props.footer}
    </div>
)
